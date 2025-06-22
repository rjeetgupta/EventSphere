import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/v1',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // Handle the ApiResponse format
    if (result.data) {
        // The backend wraps all responses in ApiResponse class
        const { statusCode, data, message, success } = result.data;
        
        // If the response indicates success
        if (success) {
            // Return the actual data
            result.data = data;
        } else {
            // Handle non-success responses
            result.error = {
                status: statusCode,
                data: { message }
            };
        }
    }

    return result;
};

export const eventApi = createApi({
    reducerPath: 'eventApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Event'],
    endpoints: (builder) => ({
        getEvents: builder.query({
            query: ({ page = 1, limit = 10, category, search }) => ({
                url: '/events',
                params: { page, limit, category, search }
            }),
            providesTags: ['Event']
        }),
        getEventById: builder.query({
            query: (id) => `/events/${id}`,
            providesTags: (result, error, id) => [{ type: 'Event', id }]
        }),
        createEvent: builder.mutation({
            query: (eventData) => ({
                url: '/events',
                method: 'POST',
                body: eventData
            }),
            invalidatesTags: ['Event']
        }),
        updateEvent: builder.mutation({
            query: ({ id, ...eventData }) => ({
                url: `/events/${id}`,
                method: 'PUT',
                body: eventData
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Event', id }]
        }),
        deleteEvent: builder.mutation({
            query: (id) => ({
                url: `/events/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Event']
        }),
        registerForEvent: builder.mutation({
            query: (id) => ({
                url: `/events/${id}/register`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Event', id }]
        }),
        unregisterFromEvent: builder.mutation({
            query: (id) => ({
                url: `/events/${id}/unregister`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Event', id }]
        })
    })
});

export const {
    useGetEventsQuery,
    useGetEventByIdQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
    useRegisterForEventMutation,
    useUnregisterFromEventMutation
} = eventApi; 