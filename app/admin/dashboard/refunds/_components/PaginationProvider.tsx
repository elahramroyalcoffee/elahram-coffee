import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import React from "react";

interface PaginationProviderProps {
  currPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function PaginationProvider({
  currPage,
  totalPages,
  onPageChange,
}: PaginationProviderProps) {
  // Generate page numbers to show
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      if (currPage <= 3) {
        // Show first pages
        pages.push(1, 2, 3, 4, 5);
      } else if (currPage >= totalPages - 2) {
        // Show last pages
        pages.push(
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        // Show pages around current
        pages.push(
          currPage - 2,
          currPage - 1,
          currPage,
          currPage + 1,
          currPage + 2
        );
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        {/* Previous button */}
        <PaginationItem>
          <Button
            variant={"outline"}
            onClick={() => currPage > 1 && onPageChange(currPage - 1)}
            className={
              currPage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          >
            الصفحة السابقة
          </Button>
        </PaginationItem>

        {/* Show first page and ellipsis if needed */}
        {currPage > 3 && totalPages > 5 && (
          <>
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(1)}
                className="cursor-pointer"
              >
                1
              </PaginationLink>
            </PaginationItem>
            {currPage > 4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onPageChange(page)}
              isActive={page === currPage}
              className="cursor-pointer"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Show ellipsis and last page if needed */}
        {currPage < totalPages - 2 && totalPages > 5 && (
          <>
            {currPage < totalPages - 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(totalPages)}
                className="cursor-pointer"
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Next button */}
        <Button
          variant={"outline"}
          onClick={() => currPage < totalPages && onPageChange(currPage + 1)}
          className={
            currPage >= totalPages
              ? "pointer-events-none opacity-50"
              : "cursor-pointer"
          }
        >
          الصفحة التالية
        </Button>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationProvider;
