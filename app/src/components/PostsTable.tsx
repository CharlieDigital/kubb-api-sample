import React, { useEffect, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { useGetPostsInfinite } from '../gen/api/hooks/useGetPostsInfinite'
import type { GetPosts200 } from '../gen/api/types/GetPosts'

type Post = GetPosts200['data'][0]

const PostsTable: React.FC = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useGetPostsInfinite(
    { page: 1, pageSize: 10 },
    {
      query: {
        retry: 3,
        refetchOnWindowFocus: false,
      },
    }
  )

  // Flatten all pages into a single array of posts
  const allPosts = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? []
  }, [data])

  const columns = useMemo<ColumnDef<Post>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: info => (
          <span className="font-mono text-sm text-gray-600">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Title',
        cell: info => (
          <span className="font-semibold text-gray-900">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'content',
        header: 'Content',
        cell: info => (
          <span className="text-gray-700 line-clamp-2">
            {info.getValue() as string}
          </span>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: allPosts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Auto-fetch next page when scrolling near bottom
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement

      if (
        scrollTop + clientHeight >= scrollHeight - 1000 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading posts...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Error loading posts</div>
        <div className="text-gray-500 text-sm">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts</h2>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading indicator for infinite scroll */}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading more posts...</span>
        </div>
      )}

      {/* End of data indicator */}
      {!hasNextPage && allPosts.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          No more posts to load
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        Showing {allPosts.length} posts
        {data?.pages && data.pages.length > 1 && ` across ${data.pages.length} pages`}
      </div>
    </div>
  )
}

export default PostsTable
