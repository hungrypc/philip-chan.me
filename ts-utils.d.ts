type MarkRequired<T, RK extends keyof T> = Exclude<T, RK> & Required<Pick<T, RK>>
