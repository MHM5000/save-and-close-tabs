import * as vscode from 'vscode';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.saveAllWithUUID', async () => {
		// Get the currently open text documents
		const openTextEditors = vscode.workspace.textDocuments;

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

		// Loop through all open documents
		for (const doc of openTextEditors) {
			if (doc.isUntitled) {
				// Generate a UUID-based filename
				const uuid = uuidv4();
				const fileExtension = doc.languageId ? `.${doc.languageId}` : '.txt'; // Use language extension or .txt by default
				const filePath = path.join(folderPath, `${uuid}${fileExtension}`);

				// Write the content of the document to disk
				fs.writeFileSync(filePath, doc.getText(), 'utf8');
				vscode.window.showInformationMessage(`Unsaved file saved as ${uuid}${fileExtension}`);

				// Close the editor after saving to disk
				const editor = await vscode.window.showTextDocument(doc);
				await vscode.commands.executeCommand('workbench.action.closeActiveEditor', editor);
			} else if (doc.isDirty) {
				// If the document is already saved but has unsaved changes, save it directly
				await doc.save();
			}
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
