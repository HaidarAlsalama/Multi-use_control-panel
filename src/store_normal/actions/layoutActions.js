import { OPEN, HALF_OPEN, OPEN_SMALL, CLOSE } from "./types";

export function openLayoutAction() {
  return {
    type: OPEN,
  };
}

export function halfOpenLayoutAction() {
  return {
    type: HALF_OPEN,
  };
}

export function openSmallLayoutAction() {
  return {
    type: OPEN_SMALL,
  };
}

export function closeLayoutAction() {
  return {
    type: CLOSE,
  };
}
