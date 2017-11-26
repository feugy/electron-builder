import { outputJson } from "fs-extra-p"
import { Lazy } from "lazy-val"
import * as path from "path"
import { Packager } from "../packager"

export class ProjectInfoManager {
  readonly infoFile = new Lazy(() => this.saveConfigurationAndMetadata())

  constructor(readonly packager: Packager) {

  }

  private async saveConfigurationAndMetadata() {
    const packager = this.packager
    const tempDir = await packager.tempDirManager.createTempDir({prefix: "remote-build-metadata"})
    // we cannot use getTempFile because file name must be constant
    const info: any = {
      metadata: packager.metadata,
      configuration: packager.config,
      repositoryInfo: packager.repositoryInfo,
    }
    if (packager.metadata !== packager.devMetadata && packager.devMetadata != null) {
      info.devMetadata = packager.devMetadata
    }
    const file = path.join(tempDir, "info.json")
    await outputJson(file, info)
    return file
  }
}