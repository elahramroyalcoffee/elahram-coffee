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

  if (totalPages <= 1) return null; // Don't show pagination if only 1 page

  return (
    <div className="mt-4 flex justify-center">
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
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

          {/* First page + ellipsis if needed */}
          {pageNumbers[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(1)}
                  className="cursor-pointer"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {pageNumbers[0] > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {/* Page numbers */}
          {pageNumbers.map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                onClick={() => onPageChange(pageNum)}
                isActive={pageNum === currPage}
                className="cursor-pointer"
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Last page + ellipsis if needed */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
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

          {/* Next Button */}
          <PaginationItem>
            <Button
              variant={"outline"}
              onClick={() =>
                currPage < totalPages && onPageChange(currPage + 1)
              }
              className={
                currPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            >
              الصفحة التالية
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default PaginationProvider;
