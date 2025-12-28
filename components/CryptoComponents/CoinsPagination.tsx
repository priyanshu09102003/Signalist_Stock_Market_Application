"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { buildPageNumbers, cn, ELLIPSIS } from "@/lib/utils"
import { useRouter } from "next/navigation"

import React from 'react'

const CoinsPagination = ({currentPage, totalPages, hasMorePages}:Pagination) => {
    const router = useRouter();
    const handlePageChange = (page: number) => {
        router.push(`/crypto/coins?page=${page}`)
    }

    const pageNumbers = buildPageNumbers(currentPage, totalPages)
    const isLast = !hasMorePages || currentPage === totalPages;


  return (
    <Pagination id="coins-pagination">
        <PaginationContent className="pagination-content">
            <PaginationItem className="pagination-control prev">
            <PaginationPrevious onClick={() => currentPage > 1 && handlePageChange(currentPage-1)}
            className={currentPage === 1 ? 'control-disabled' : 'control-button'}
            />
            </PaginationItem>

            <div className="pagination-pages">
                {pageNumbers.map((page , index)=> (
                    <PaginationItem key={index}>

                        {page === ELLIPSIS ? (<span className="ellipsis">...</span>) : 
                            (
                                <PaginationLink onClick={() => handlePageChange(page)} className={cn('page-link' , {
                                    'page-link-active':currentPage === page
                                })}>{page}</PaginationLink>
                            )
                        }
                    </PaginationItem>
                ))}
            </div>


            <PaginationItem className="pagination-control next">
            <PaginationNext 
            onClick={() => !isLast && handlePageChange(currentPage+1)}
            className={isLast? 'control-disabled' : 'control-button'} 
            />
            </PaginationItem>
        </PaginationContent>
    </Pagination>
  )
}

export default CoinsPagination
