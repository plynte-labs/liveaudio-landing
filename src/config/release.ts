import releaseMeta from "./release.json";

export const LIVEAUDIO_VERSION = releaseMeta.version;
export const LIVEAUDIO_TAG = `v${LIVEAUDIO_VERSION}`;

export const REPO_URL = "https://github.com/plynte-labs/LiveAudio";
export const RELEASES_URL = `${REPO_URL}/releases`;
export const RELEASE_LATEST_URL = `${RELEASES_URL}/latest`;
export const RELEASE_TAG_URL = `${RELEASES_URL}/tag/${LIVEAUDIO_TAG}`;
export const RELEASE_DOWNLOAD_BASE = `${RELEASES_URL}/download/${LIVEAUDIO_TAG}`;
export const CHECKSUMS_URL = RELEASE_LATEST_URL;
export const ISSUES_URL = `${REPO_URL}/issues`;

export const WINDOWS_INSTALLER_FILENAME = `LiveAudio-Setup-${LIVEAUDIO_VERSION}.exe`;
export const WINDOWS_INSTALLER_URL = `${RELEASE_DOWNLOAD_BASE}/${WINDOWS_INSTALLER_FILENAME}`;
export const WINDOWS_INSTALLER_SIZE = "23.1 MB";

export const LINUX_APPIMAGE_FILENAME = `LiveAudio_${LIVEAUDIO_VERSION}_amd64.AppImage`;
export const LINUX_APPIMAGE_URL = `${RELEASE_DOWNLOAD_BASE}/${LINUX_APPIMAGE_FILENAME}`;
export const LINUX_APPIMAGE_SIZE = "97.5 MB";

export const LINUX_DEB_FILENAME = `LiveAudio_${LIVEAUDIO_VERSION}_amd64.deb`;
export const LINUX_DEB_URL = `${RELEASE_DOWNLOAD_BASE}/${LINUX_DEB_FILENAME}`;
export const LINUX_DEB_SIZE = "25.6 MB";

export const WINDOWS_CLI_FILENAME = `liveaudio-cli-${LIVEAUDIO_VERSION}-windows-x64.zip`;
export const WINDOWS_CLI_URL = `${RELEASE_DOWNLOAD_BASE}/${WINDOWS_CLI_FILENAME}`;
export const WINDOWS_CLI_SIZE = "21.3 MB";

export const LINUX_CLI_FILENAME = `liveaudio-cli-${LIVEAUDIO_VERSION}-linux-x64.tar.gz`;
export const LINUX_CLI_URL = `${RELEASE_DOWNLOAD_BASE}/${LINUX_CLI_FILENAME}`;
export const LINUX_CLI_SIZE = "14.3 MB";

export const LINUX_DESKTOP_LABEL = LINUX_APPIMAGE_FILENAME;
export const LINUX_DESKTOP_URL = LINUX_APPIMAGE_URL;
