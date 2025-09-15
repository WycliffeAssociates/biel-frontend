import type { TsDirectoryFile, TsDirectoryLang } from "@customTypes/types";
import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import { createSignal, For, Show } from "solid-js";
import { useResourceSingleContext } from "../ResourceSingleContext";

type FilterMenuProps = {
	isBig?: boolean;
};

export function DownloadablesFilterMenu(props: FilterMenuProps) {
	const { i18nDict, selectedTsFolder, setSelectedTsFolder, allTsFiles } =
		useResourceSingleContext();
	const [resourceTypesToFilterBy, setResourceTypesToFilterBy] = createSignal<
		string[]
	>([]);
	const [sortSelected, setSortSelected] = createSignal("AZ");
	const [sortVisual, setSortVisual] = createSignal("alphabetic");

	const sorts = [
		{
			label: "Alphabetical",
			value: "alphabetic",
			subValues: [
				{
					value: "AZ",
					label: i18nDict.rl_A_Z,
					scope: "alphabetic",
				},
				{
					value: "ZA",
					label: i18nDict.rl_Z_A,
					scope: "alphabetic",
				},
			],
		},
		{
			label: "Date",
			value: "date",
			subValues: [
				{
					value: "MRU",
					label: null,
					scope: "date",
				},
				{
					value: "LRU",
					label: null,
					scope: "date",
				},
			],
		},
	];

	const currentFolderFromAllTsFiles = () => {
		const pickedFolder =
			allTsFiles?.trainingFiles?.folders[
				selectedTsFolder()?.folderName || ""
			] ||
			allTsFiles?.trainingFiles?.folders[selectedTsFolder()?.folderName || ""];
		return pickedFolder;
	};

	const uniqueFileTypesInThisFolder = () => {
		const pickedFolder = currentFolderFromAllTsFiles();
		if (!pickedFolder) return [];

		const getFileTypes = (node: TsDirectoryLang, files: Set<string>) => {
			node?.files.forEach((file: TsDirectoryFile) => {
				files.add(file.fileType);
			});

			if (node.folders) {
				Object.values(node.folders).forEach((node) => {
					getFileTypes(node, files);
				});
			}
			return files;
		};

		const fileTypes = getFileTypes(pickedFolder, new Set());
		if (!fileTypes) return [];
		return [...fileTypes];
	};

	const sortFiles = (files: TsDirectoryFile[]) => {
		switch (sortSelected()) {
			case "AZ":
				return files.sort((a, b) => {
					return a.fileName.localeCompare(b.fileName);
				});
			case "ZA":
				return files.sort((a, b) => {
					return b.fileName.localeCompare(a.fileName);
				});
			case "MRU": {
				const now = new Date();
				return files.sort((a, b) => {
					return (
						new Date(b.lastUpdated || now).getTime() -
						new Date(a.lastUpdated || now).getTime()
					);
				});
			}
			case "LRU": {
				const now = new Date();
				return files.sort((a, b) => {
					return (
						new Date(a.lastUpdated || now).getTime() -
						new Date(b.lastUpdated || now).getTime()
					);
				});
			}
			default:
				return files;
		}
	};
	const sortTree = (tree: TsDirectoryLang) => {
		tree.files = sortFiles(tree.files);
		if (tree.folders) {
			Object.values(tree.folders).forEach((node) => {
				sortTree(node);
			});
		}
		return tree;
	};

	const filterFilesByType = () => {
		if (!allTsFiles) return;
		const currentFolderAllFiles = currentFolderFromAllTsFiles();
		if (!currentFolderAllFiles) return;
		const copy = JSON.parse(
			JSON.stringify(currentFolderAllFiles),
		) as TsDirectoryLang;

		if (!resourceTypesToFilterBy().length) {
			return setSelectedTsFolder({
				folderName: selectedTsFolder()?.folderName || "",
				subTree: sortTree(copy),
			});
		}
		// we have to make a copy cause you can't directly mutate solid stores/signals.
		const filterNode = (node: TsDirectoryLang) => {
			node.files = node.files.filter((file: TsDirectoryFile) => {
				return resourceTypesToFilterBy().includes(file.fileType);
			});
			if (node.folders) {
				Object.values(node.folders).forEach((node) => {
					filterNode(node);
				});
			}
		};
		// mutates a fresh copy of allTsFiles for this folder;

		filterNode(sortTree(copy));
		setSelectedTsFolder({
			folderName: selectedTsFolder()?.folderName || "",
			subTree: copy,
		});
	};
	const toggleResourceType = (isChecked: boolean, type: string) => {
		if (isChecked) {
			setResourceTypesToFilterBy((prev) => [...prev, type]);
		} else {
			setResourceTypesToFilterBy((prev) =>
				prev.filter((existing) => type !== existing),
			);
		}
	};

	return (
		<DropdownMenu placement="bottom-end">
			<DropdownMenu.Trigger
				data-name="dropdown-menu__trigger"
				class={`${
					props.isBig
						? "rounded-lg size-10 aspect-square hover:bg-surface-secondary"
						: ""
				}`}
			>
				<span class={"i-ic:round-filter-alt w-1em h-1em"} />
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					class="bg-surface-primary z-10 shadow-lg rounded-xl text-onSurface-secondary flex flex-col gap-4  w-84 max-w-90vw"
					data-name="dropdown-menu__content"
				>
					<div data-name="downloadableFilters" class="">
						<p class="font-step-0 font-500 px-4 pbs-4">{i18nDict.rl_Filter}</p>
						<ul class="flex flex-col">
							<For each={uniqueFileTypesInThisFolder()}>
								{(fileType) => (
									<li class="text-onSurface-secondary font-step-0">
										<DropdownMenu.CheckboxItem
											class="group p-4 data-[highlighted]:(text-brand-base) group-data-[checked]:(text-brand-base font-500) cursor-pointer focus:(outline-none bg-brand-light) hover:(outline-none bg-brand-light)"
											checked={resourceTypesToFilterBy().includes(fileType)}
											onChange={(isChecked) => {
												toggleResourceType(isChecked, fileType);
												filterFilesByType();
											}}
										>
											<div class="flex justify-between group-data-[checked]:(text-brand-base font-500) ">
												<div class="flex gap-4 items-center ">
													<div class="h-16px w-16px border-2 border-onSurface-secondary border-solid rounded-sm  group-data-[checked]:(border-brand-base bg-brand-base) ">
														<DropdownMenu.ItemIndicator
															data-name="dropdown-menu__item-indicator"
															class="grid place-content-center h-full w-full"
														>
															<span class="i-material-symbols:check-rounded text-surface-primary size-16px" />
														</DropdownMenu.ItemIndicator>
													</div>
													<span>{fileType}</span>
												</div>
												<FileTypeIcon type={fileType} />
											</div>
										</DropdownMenu.CheckboxItem>
									</li>
								)}
							</For>
						</ul>
					</div>
					<div data-name="downloadableSorts" class="">
						<p class="font-step-0 font-500 px-4">{i18nDict.rl_Sort}</p>
						<DropdownMenu.RadioGroup
							class="list-none flex-col flex "
							value={sortVisual()}
						>
							<For each={sorts}>
								{(sort) => (
									<DropdownMenu.RadioItem
										value={sort.value}
										class="flex p-4 items-center gap-4 justify-between text-onSurface-secondary cursor-pointer font-step-0 group focus:(outline-none bg-brand-light) hover:(outline-none bg-brand-light)"
										onSelect={() => {
											setSortVisual(sort.value);
											setSortSelected(sort.subValues[0]!.value);
											filterFilesByType();
										}}
									>
										<div class="flex justify-between">
											<div class="flex gap-4 items-center">
												<div class="h-24px w-24px border-2 border-onSurface-secondary border-solid  group-data-[checked]:(border-brand-base) rounded-full grid place-content-center">
													<DropdownMenu.ItemIndicator
														data-name="dropdown-menu__item-indicator"
														class="size-14px rounded-full group-data-[checked]:(bg-brand-base)"
													/>
												</div>
												<span>{sort.label}</span>
											</div>
										</div>
										<Show
											when={sort.subValues.some(
												(subValue) => subValue.scope === sortVisual(),
											)}
										>
											<Show when={sort.subValues[0]!.value === sortSelected()}>
												<button
													type="button"
													class="flex gap-2 items-center"
													on:click={(e) => {
														e.stopPropagation();
														setSortSelected(sort.subValues[1]!.value);
														filterFilesByType();
													}}
												>
													<span>{sort.subValues[0]!.label}</span>
													<span class="i-solar-arrow-up-linear w-1em h-1em" />
												</button>
											</Show>
											<Show when={sort.subValues[1]!.value === sortSelected()}>
												<button
													type="button"
													class="flex gap-2 items-center"
													on:click={(e) => {
														e.stopPropagation();
														setSortSelected(sort.subValues[0]!.value);
														filterFilesByType();
													}}
												>
													<span>{sort.subValues[1]!.label}</span>
													<span class="i-solar-arrow-up-linear w-1em h-1em rotate-180" />
												</button>
											</Show>
										</Show>
									</DropdownMenu.RadioItem>
								)}
							</For>
						</DropdownMenu.RadioGroup>
					</div>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu>
	);
}

function FileTypeIcon(props: { type: string }) {
	const className = "w-1em h-1em";
	switch (props.type.toLowerCase()) {
		case "pdf":
			return <span class={`i-fa:file-pdf-o w-1em h-1em ${className}`} />;
		case "docx":
			return <span class={`i-fa-solid:file-word w-1em h-1em ${className}`} />;
		case "pptx":
			return (
				<span class={`i-fa6-solid:file-powerpoint w-1em h-1em ${className}`} />
			);
		default:
			return null;
	}
}
