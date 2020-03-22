import {
  Column,
  UseFiltersColumnOptions,
  TableInstance,
  UsePaginationInstanceProps,
  UseSortByInstanceProps,
  UseFiltersInstanceProps,
  TableOptions,
  UseFiltersOptions,
  UsePaginationOptions,
  UseSortByOptions,
  TableState,
  UseSortByState,
  UsePaginationState,
  UseFiltersState,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersOptions,
  UseGlobalFiltersState,
  UseGlobalFiltersColumnOptions
} from "react-table";

export interface Publisher {
  name: string;
  mbox: string;
}

export interface Distribution {
  title: string;
  format: string;
  accessURL: string;
}

export interface Dataset {
  id: string;
  title: string;
  antall: string;
  description: any;
  landingPage: string;
  issued: string;
  modified: string;
  publisher: Publisher;
  keyword: string[];
  distribution: Distribution[];
}

export type DatasetColumn = Column<Dataset> &
  UseFiltersColumnOptions<Dataset> &
  UseGlobalFiltersColumnOptions<Dataset>;

export type DatasetTableState = TableState<Dataset> &
  UsePaginationState<Dataset> &
  UseSortByState<Dataset> &
  UseFiltersState<Dataset> &
  UseGlobalFiltersState<Dataset>;

export type DatasetTableOptions = TableOptions<Dataset> &
  UsePaginationOptions<Dataset> &
  UseSortByOptions<Dataset> &
  UseFiltersOptions<Dataset> &
  UseGlobalFiltersOptions<Dataset> & {
    initialState: Partial<DatasetTableState>;
  };

export type DatasetTableInstance = TableInstance<Dataset> &
  UsePaginationInstanceProps<Dataset> &
  UseSortByInstanceProps<Dataset> &
  UseFiltersInstanceProps<Dataset> & {
    state: DatasetTableState;
  } & UseGlobalFiltersInstanceProps<Dataset>;
