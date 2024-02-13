export type DropdownItemDeprecatedType =
  | { value?: string; label: string; icons?: React.ComponentType<any>[] }
  | string;

export type NormalizedDropdownItemDeprecatedType = {
  value: string;
  label: string;
  icons?: React.ComponentType<any>[];
};

type AsyncDropdownItemDeprecatedType = (
  inputType: string,
  abortControllerRef: React.MutableRefObject<AbortController>,
) => Promise<DropdownItemDeprecatedType[]>;
type SyncDropdownItemDeprecatedType = (
  inputType: string,
  abortControllerRef: React.MutableRefObject<AbortController>,
) => DropdownItemDeprecatedType[];
export type PotentiallyAsyncDropdownItemDeprecatedType =
  | DropdownItemDeprecatedType[]
  | SyncDropdownItemDeprecatedType
  | AsyncDropdownItemDeprecatedType;
