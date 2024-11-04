import {DropdownMenu} from "@kobalte/core/dropdown-menu";
import type {i18nDictType} from "@src/i18n/strings";
import {
  useResourceSingleContext,
  type tsFolderState,
} from "../ResourceSingleContext";
import type {TsDirectoryFile, TsDirectoryLang} from "@customTypes/types";
import {createEffect, createSignal, For} from "solid-js";

type FilterMenuProps = {
  isBig?: boolean;
};

export function DownloadablesFilterMenu(props: FilterMenuProps) {
  const {i18nDict, selectedTsFolder, setSelectedTsFolder, allTsFiles} =
    useResourceSingleContext();
  const [resourceTypesToFilterBy, setResourceTypesToFilterBy] = createSignal<
    string[]
  >([]);
  const [sortSelected, setSortSelected] = createSignal("AZ");
  const sorts = [
    {
      label: i18nDict.rl_A_Z,
      value: "AZ",
    },
    {
      label: i18nDict.rl_Z_A,
      value: "ZA",
    },
    // todo: i18n
    {
      label: "Most Recently Updated",
      value: "MRU",
    },
    // todo: i18n
    {
      label: "Least Recently Updated",
      value: "LRU",
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
        Object.entries(node.folders).forEach(([folderName, node]) => {
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
      Object.entries(tree.folders).forEach(([folderName, node]) => {
        sortTree(node);
      });
    }
    return tree;
  };
  const callShortTreeDirect = () => {
    if (!allTsFiles) return;
    const currentFolderAllFiles = currentFolderFromAllTsFiles();
    if (!currentFolderAllFiles) return;
    const copy = JSON.parse(
      JSON.stringify(currentFolderAllFiles)
    ) as TsDirectoryLang;
    sortTree(copy);
    return setSelectedTsFolder({
      folderName: selectedTsFolder()?.folderName || "",
      subTree: sortTree(copy),
    });
  };

  const filterFilesByType = () => {
    if (!allTsFiles) return;
    const currentFolderAllFiles = currentFolderFromAllTsFiles();
    if (!currentFolderAllFiles) return;
    const copy = JSON.parse(
      JSON.stringify(currentFolderAllFiles)
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
        Object.entries(node.folders).forEach(([folderName, node]) => {
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
        prev.filter((existing) => type !== existing)
      );
    }
  };

  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenu.Trigger
        class={`${
          props.isBig
            ? "bg-surface-secondary rounded-lg size-10 aspect-square"
            : ""
        }`}
      >
        <span class={"i-ic:round-filter-alt w-1em h-1em"} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          class="bg-surface-primary p-4 z-10 shadow-md rounded-xl text-onSurface-secondary flex flex-col gap-4"
          data-name="dropdown-menu__content"
        >
          <div data-name="downloadableFilters" class="">
            <p class="mb-4 font-step-0 font-500">{i18nDict.rl_Filter}</p>
            <ul class="flex flex-col gap-4">
              <For each={uniqueFileTypesInThisFolder()}>
                {(fileType) => (
                  <li class="text-onSurface-secondary font-step-0">
                    <DropdownMenu.CheckboxItem
                      class=" group data-[highlighted]:(text-brand-base) group-data-[checked]:(text-brand-base font-500) cursor-pointer focus:(outline-none bg-brand-light)"
                      checked={resourceTypesToFilterBy().includes(fileType)}
                      onChange={(isChecked) => {
                        toggleResourceType(isChecked, fileType);
                        filterFilesByType();
                      }}
                    >
                      <div class="flex justify-between ">
                        <div class="flex gap-2 items-center">
                          <div class="h-24px w-24px border-2 border-onSurface-secondary border-solid rounded-sm  group-data-[checked]:(border-brand-base bg-brand-base) ">
                            <DropdownMenu.ItemIndicator
                              data-name="dropdown-menu__item-indicator"
                              class="grid place-content-center h-full w-full"
                            >
                              <span class="i-material-symbols:check-rounded text-surface-primary size-24px" />
                            </DropdownMenu.ItemIndicator>
                          </div>
                          <span>{fileType}</span>
                        </div>
                      </div>
                    </DropdownMenu.CheckboxItem>
                  </li>
                )}
              </For>
            </ul>
          </div>
          <div data-name="downloadableSorts" class="">
            <p class="mb-4 font-step-0 font-500">{i18nDict.rl_Sort}</p>
            <DropdownMenu.RadioGroup
              class="list-none flex-col flex gap-4"
              value={sortSelected()}
            >
              <For each={sorts}>
                {(sort) => (
                  <DropdownMenu.RadioItem
                    value={sort.value}
                    class="flex items-center gap-2 text-onSurface-secondary font-step-0 group"
                    onSelect={() => {
                      setSortSelected(sort.value);
                      filterFilesByType();
                    }}
                  >
                    <div class="h-24px w-24px border-2 border-onSurface-secondary border-solid  group-data-[checked]:(border-brand-base) rounded-full grid place-content-center">
                      <DropdownMenu.ItemIndicator
                        data-name="dropdown-menu__item-indicator"
                        class="size-14px rounded-full group-data-[checked]:(bg-brand-base)"
                      />
                    </div>
                    <span>{sort.label}</span>
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
