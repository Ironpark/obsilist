import { Plugin } from "obsidian";
import { ExampleView, VIEW_TYPE_EXAMPLE } from "./views/ExampleView";
import "virtual:uno.css";
import Component from "./components/ObsiList.svelte";

interface ObsidianNoteConnectionsSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ObsidianNoteConnectionsSettings = {
	mySetting: "default",
};

export default class ObsidianNoteConnections extends Plugin {
	settings!: ObsidianNoteConnectionsSettings;

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async onload() {
		await this.loadSettings();
		this.registerMarkdownCodeBlockProcessor("obsilist", (source, el,ctx) => {
			const content = document.createElement("div");
			let comp = new Component({
				target: content,
				props: {
					app:this.app,
					metadata:this.app.metadataCache,
					vault:this.app.vault,
					source,
				}
			});
			el.appendChild(content);
		});
		//
		// this.registerView(VIEW_TYPE_EXAMPLE, (leaf) => new ExampleView(leaf));
		// this.addRibbonIcon("dice", "Activate view", () => {
		// 	this.activateView();
		// });
	}

	onunload() {
		console.log("unloading plugin");
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE);

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: VIEW_TYPE_EXAMPLE,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE)[0],
		);
	}
}
