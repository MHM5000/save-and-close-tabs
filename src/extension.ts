import * as vscode from 'vscode';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.saveAllWithUUID', async () => {
		const openTextEditors = vscode.window.visibleTextEditors;

		if (openTextEditors.length === 0) {
			vscode.window.showInformationMessage('No open files to save.');
			return;
		}

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
			const filePath = path.join(folderPath, `${uuid}.txt`); // Add extension based on file type if needed

			fs.writeFileSync(filePath, content, 'utf8');
			vscode.window.showInformationMessage(`File saved as ${uuid}.txt`);
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
