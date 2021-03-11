import * as vscode from "vscode";

let myStatusBarItem: vscode.StatusBarItem;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate({ subscriptions }: vscode.ExtensionContext) {
  // register a command that is invoked when the status bar
  // item is selected
  const myCommandId = "openCoverage.openBrowser";
  subscriptions.push(
    vscode.commands.registerCommand(myCommandId, () => {
		openCoverage();
    })
  );
  // create a new status bar item that we can now manage
  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );

  myStatusBarItem.command = myCommandId;
  subscriptions.push(myStatusBarItem);

  startStatusBarItem();
}

function startStatusBarItem(): void {
  myStatusBarItem.text = "Open Coverage";
  myStatusBarItem.show();
}

async function checkFileExistence(uri: vscode.Uri): Promise<Boolean> {
  if (vscode.workspace.workspaceFolders !== undefined) {
    try {
      await vscode.workspace.fs.stat(uri);
      return true;
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
}

/**
 * Get stat of a file to check if it's available
 * @param filename
 */
function getFileUri(): vscode.Uri | undefined {
  if (vscode.workspace.workspaceFolders !== undefined) {
    const workspaceFolderUri = vscode.workspace.workspaceFolders[0].uri;
	// Extract the path from the configuration (default: coverage/lcov-report/index.html)
    const relativeFilePath = vscode.workspace.getConfiguration('openCoverage').coverageFilePath;
    const fileUri = vscode.Uri.joinPath(workspaceFolderUri, relativeFilePath);
    return fileUri;
  }
}

async function openCoverage(): Promise<void> {
  const uri = getFileUri();
  if(uri) {
	const exists = await checkFileExistence(uri);
	if(exists) {
	  vscode.env.openExternal(uri);
	} else {
	  vscode.window.showInformationMessage('No coverage file found');
	}  
  } else {
	vscode.window.showInformationMessage('You need to be inside a VSCode Workspace to use this plugin');
  }

}
