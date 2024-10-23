import * as vscode from 'vscode';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.saveAllWithUUID', async () => {
		// Get the currently open text editors
		const openTextEditors = vscode.workspace.textDocuments;

		if (openTextEditors.length === 0) {
			vscode.window.showInformationMessage('No open files to save.');
			return;
		}

		// Ask the user to select a directory where files should be saved
		const folder = await vscode.window.showOpenDialog({ canSelectFolders: true, canSelectMany: false });

		if (!folder || folder.length === 0) {
			vscode.window.showErrorMessage('You need to select a folder to save files.');
			return;
		}

		const folderPath = folder[0].fsPath;

		// Loop through all open files
		openTextEditors.forEach((doc) => {
			if (doc.isUntitled) {
				// Generate a UUID-based filename
				const uuid = uuidv4();
				const fileExtension = doc.languageId ? `.${doc.languageId}` : '.txt'; // Use language extension or .txt as default
				const filePath = path.join(folderPath, `${uuid}${fileExtension}`);

				// Write file content to disk
				fs.writeFileSync(filePath, doc.getText(), 'utf8');
				vscode.window.showInformationMessage(`Unsaved file saved as ${uuid}${fileExtension}`);
			} else if (doc.isDirty) {
				// If the file is already saved but dirty (unsaved changes), save it directly
				doc.save().then(() => {
					vscode.window.showInformationMessage(`Saved file: ${doc.fileName}`);
				});
			}
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
