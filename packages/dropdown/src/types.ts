export type DropdownItemType<ValueType = string> =
  | { value?: ValueType; label: string; icons?: React.ComponentType<any>[] }
  | string;

export type NormalizedDropdownItemType<ValueType = string> = {
  value: ValueType;
  label: string;
  icons?: React.ComponentType<any>[];
};

export type AsyncDropdownItemType<ValueType = string> = (
  inputType: string,
  abortControllerRef: React.MutableRefObject<AbortController>,
) => Promise<DropdownItemType<ValueType>[]>;

export type SyncDropdownItemType<ValueType = string> = (
  inputType: string,
  abortControllerRef: React.MutableRefObject<AbortController>,
) => DropdownItemType<ValueType>[];

export type PotentiallyAsyncDropdownItemType<ValueType = string> =
  | DropdownItemType<ValueType>[]
  | SyncDropdownItemType<ValueType>
  | AsyncDropdownItemType<ValueType>;
