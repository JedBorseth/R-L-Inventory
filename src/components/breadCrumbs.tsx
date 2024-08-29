"use client";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

import { usePathname } from "next/navigation";
import { Fragment } from "react";

const Breadcrumbs = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);
  let combinedUrl = "";
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {paths.map((path, index) => {
          combinedUrl += path + "/";
          path === "wasteCalculator" ? (path = "Waste Calculator") : null;
          path === "finishedItems" ? (path = "Finished Materials") : null;

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`../../${combinedUrl}`}>
                    {path.charAt(0).toUpperCase() + path.slice(1)}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index === paths.length - 1 ? null : <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
