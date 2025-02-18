export interface Column {
    field: string;
    title: string;
    isUnique?: boolean;
    sortable?: boolean;
    width?: string;
    formatter?: (value: any, row: any) => string | number;
}

export interface TableProps<T> {
    rows: T[];
    columns: Column[];
    pagination?: boolean;
    itemsPerPage?: number;
    sortable?: boolean;
    loading?: boolean;
    rowLink?: (row: T) => string;
    onSort?: (field: string, direction: 'asc' | 'desc') => void;
    onPageChange?: (page: number) => void;
}

export interface SortState {
    field: string;
    direction: 'asc' | 'desc';
}
