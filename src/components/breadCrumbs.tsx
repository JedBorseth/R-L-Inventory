"use client";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

import { usePathname } from "next/navigation";

const Breadcrumbs = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {paths.map((path, index) => {
          return (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">
                    {path.charAt(0).toUpperCase() + path.slice(1)}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index === paths.length - 1 ? null : <BreadcrumbSeparator />}
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
