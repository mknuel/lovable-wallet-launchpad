
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_VERSION, SERVER_URL } from '../../config';

export const walletApi = createApi({
  reducerPath: 'walletApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_URL}/api/${API_VERSION}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Wallet'],
  endpoints: (builder) => ({
    getWallet: builder.query({
      query: () => '/user/wallet',
      providesTags: ['Wallet'],
    }),
  }),
});

export const { useGetWalletQuery } = walletApi;
