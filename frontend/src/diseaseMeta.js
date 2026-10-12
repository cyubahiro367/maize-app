/*
  Ties each predicted class to the colour of its actual lesion, as described
  in the proposal (Section 1.2), so the UI's colour-coding is diagnostic
  information, not decoration.
*/
export const DISEASE_META = {
  grey_leaf_spot: {
    color: "var(--color-spot)",
    labelKey: "class_grey_leaf_spot",
  },
  northern_leaf_blight: {
    color: "var(--color-blight)",
    labelKey: "class_northern_leaf_blight",
  },
  common_rust: {
    color: "var(--color-rust)",
    labelKey: "class_common_rust",
  },
  healthy: {
    color: "var(--color-leaf)",
    labelKey: "class_healthy",
  },
};

export function getDiseaseMeta(code) {
  return DISEASE_META[code] || DISEASE_META.healthy;
}
