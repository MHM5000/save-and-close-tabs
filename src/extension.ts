import * as vscode from 'vscode';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "Save All with UUID" is now active!');

	// Register the command
	let disposable = vscode.commands.registerCommand('extension.saveAllWithUUID', async () => {
		// Get the list of open text editors
		const openTextEditors = vscode.window.visibleTextEditors;

		if (openTextEditors.length === 0) {
			vscode.window.showInformationMessage('No open files to save.');
			return;
		}

		// Ask the user for a directory to save the files
		const folder = await vscode.window.showOpenDialog({ canSelectFolders: true, canSelectMany: false });

		if (!folder || folder.length === 0) {
			vscode.window.showErrorMessage('You need to select a folder to save files.');
			return;
		}

		const folderPath = folder[0].fsPath;

		openTextEditors.forEach((editor) => {
			const doc = editor.document;
			const content = doc.getText();
			const uuid = uuidv4();
			const fileExtension = path.extname(doc.fileName) || '.txt';
			const filePath = path.join(folderPath, `${uuid}${fileExtension}`);

			fs.writeFileSync(filePath, content, 'utf8');
			vscode.window.showInformationMessage(`File saved as ${uuid}${fileExtension}`);
		});
	});

	// Add the command to the extension's context
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
