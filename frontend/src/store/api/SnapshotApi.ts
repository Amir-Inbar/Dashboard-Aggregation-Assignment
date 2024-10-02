import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_HOST } from '../../utils/consts.ts';
import { SnapshotSchema } from '../../@types/SnapshotSchema.ts';

export const SnapshotApi = createApi({
  reducerPath: 'snapshotApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_HOST,
    headers: { 'Content-Type': 'application/json' },
  }),
  tagTypes: ['Snapshot'],
  endpoints: (builder) => ({
    getSnapshots: builder.query<SnapshotSchema[], void>({
      query: () => 'api/snapshots',
      providesTags: ['Snapshot'],
    }),
    getAggregationSnapshots: builder.query<
      SnapshotSchema,
      { minDatetime: string; maxDatetime: string }
    >({
      query: ({ minDatetime, maxDatetime }) =>
        `api/aggregation?minDatetime=${encodeURIComponent(
          minDatetime
        )}&maxDatetime=${encodeURIComponent(maxDatetime)}`,
      providesTags: ['Snapshot'],
    }),
    getMinMaxDates: builder.query<{ minDate: string; maxDate: string }, void>({
      query: () => 'api/aggregation/date',
    }),
  }),
});

export const {
  useGetSnapshotsQuery,
  useGetAggregationSnapshotsQuery,
  useGetMinMaxDatesQuery,
} = SnapshotApi;
