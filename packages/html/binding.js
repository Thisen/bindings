const { existsSync, readFileSync } = require("fs");
const { join } = require("path");

const { platform, arch } = process;

let nativeBinding = null;
let localFileExisted = false;
let loadError = null;

function isMusl() {
  // For Node 10
  if (!process.report || typeof process.report.getReport !== "function") {
    try {
      return readFileSync("/usr/bin/ldd", "utf8").includes("musl");
    } catch (e) {
      return true;
    }
  } else {
    const { glibcVersionRuntime } = process.report.getReport().header;
    return !glibcVersionRuntime;
  }
}

switch (platform) {
  case "android":
    switch (arch) {
      case "arm64":
        localFileExisted = existsSync(
          join(__dirname, "html.android-arm64.node")
        );
        try {
          if (localFileExisted) {
            nativeBinding = require("./html.android-arm64.node");
          } else {
            nativeBinding = require("@swc/html-android-arm64");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      case "arm":
        localFileExisted = existsSync(
          join(__dirname, "html.android-arm-eabi.node")
        );
        try {
          if (localFileExisted) {
            nativeBinding = require("./html.android-arm-eabi.node");
          } else {
            nativeBinding = require("@swc/html-android-arm-eabi");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      default:
        throw new Error(`Unsupported architecture on Android ${arch}`);
    }
    break;
  case "win32":
    switch (arch) {
      case "x64":
        localFileExisted = existsSync(
          join(__dirname, "html.win32-x64-msvc.node")
        );
        try {
          if (localFileExisted) {
            nativeBinding = require("./html.win32-x64-msvc.node");
          } else {
            nativeBinding = require("@swc/html-win32-x64-msvc");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      case "ia32":
        localFileExisted = existsSync(
          join(__dirname, "html.win32-ia32-msvc.node")
        );
        try {
          if (localFileExisted) {
            nativeBinding = require("./html.win32-ia32-msvc.node");
          } else {
            nativeBinding = require("@swc/html-win32-ia32-msvc");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      case "arm64":
        localFileExisted = existsSync(
          join(__dirname, "html.win32-arm64-msvc.node")
        );
        try {
          if (localFileExisted) {
            nativeBinding = require("./html.win32-arm64-msvc.node");
          } else {
            nativeBinding = require("@swc/html-win32-arm64-msvc");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      default:
        throw new Error(`Unsupported architecture on Windows: ${arch}`);
    }
    break;
  case "darwin":
    switch (arch) {
      case "x64":
        localFileExisted = existsSync(join(__dirname, "html.darwin-x64.node"));
        try {
          if (localFileExisted) {
            nativeBinding = require("./html.darwin-x64.node");
          } else {
            nativeBinding = require("@swc/html-darwin-x64");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      case "arm64":
        localFileExisted = existsSync(
          join(__dirname, "html.darwin-arm64.node")
        );
        try {
          if (localFileExisted) {
            nativeBinding = require("./html.darwin-arm64.node");
          } else {
            nativeBinding = require("@swc/html-darwin-arm64");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      default:
        throw new Error(`Unsupported architecture on macOS: ${arch}`);
    }
    break;
  case "freebsd":
    if (arch !== "x64") {
      throw new Error(`Unsupported architecture on FreeBSD: ${arch}`);
    }
    localFileExisted = existsSync(join(__dirname, "html.freebsd-x64.node"));
    try {
      if (localFileExisted) {
        nativeBinding = require("./html.freebsd-x64.node");
      } else {
        nativeBinding = require("@swc/html-freebsd-x64");
      }
    } catch (e) {
      loadError = e;
    }
    break;
  case "linux":
    switch (arch) {
      case "x64":
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, "html.linux-x64-musl.node")
          );
          try {
            if (localFileExisted) {
              nativeBinding = require("./html.linux-x64-musl.node");
            } else {
              nativeBinding = require("@swc/html-linux-x64-musl");
            }
          } catch (e) {
            loadError = e;
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, "html.linux-x64-gnu.node")
          );
          try {
            if (localFileExisted) {
              nativeBinding = require("./html.linux-x64-gnu.node");
            } else {
              nativeBinding = require("@swc/html-linux-x64-gnu");
            }
          } catch (e) {
            loadError = e;
          }
        }
        break;
      case "arm64":
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, "html.linux-arm64-musl.node")
          );
          try {
            if (localFileExisted) {
              nativeBinding = require("./html.linux-arm64-musl.node");
            } else {
              nativeBinding = require("@swc/html-linux-arm64-musl");
            }
          } catch (e) {
            loadError = e;
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, "html.linux-arm64-gnu.node")
          );
          try {
            if (localFileExisted) {
              nativeBinding = require("./html.linux-arm64-gnu.node");
            } else {
              nativeBinding = require("@swc/html-linux-arm64-gnu");
            }
          } catch (e) {
            loadError = e;
          }
        }
        break;
      case "arm":
        localFileExisted = existsSync(
          join(__dirname, "html.linux-arm-gnueabihf.node")
        );
        try {
          if (localFileExisted) {
            nativeBinding = require("./html.linux-arm-gnueabihf.node");
          } else {
            nativeBinding = require("@swc/html-linux-arm-gnueabihf");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      default:
        throw new Error(`Unsupported architecture on Linux: ${arch}`);
    }
    break;
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`);
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError;
  }
  throw new Error(`Failed to load native binding`);
}

const { minify, minifyFragment, minifySync, minifyFragmentSync } =
  nativeBinding;

module.exports.minify = minify;
module.exports.minifyFragment = minifyFragment;
module.exports.minifySync = minifySync;
module.exports.minifyFragmentSync = minifyFragmentSync;
