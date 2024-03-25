import type {translationPageOldEntry} from "@customTypes/types";
import {createSignal} from "solid-js";

// Default lang is english;
export const [selectedLang, setSelectedLang] =
  createSignal<translationPageOldEntry>();
