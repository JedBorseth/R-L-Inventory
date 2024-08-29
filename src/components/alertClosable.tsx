"use client";
import { CircleX, RocketIcon, SquareX } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CustomAlert = () => {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scaleY: 0 }}
        >
          <Alert variant="destructive" className="relative my-2">
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Looking for scrap?</AlertTitle>
            <AlertDescription>
              Try the <strong>new</strong>{" "}
              <Link href="/dashboard/wasteCalculator" className="underline">
                waste calculator
              </Link>{" "}
              feature today.
            </AlertDescription>
            <button
              className="absolute right-2 top-2"
              onClick={() => {
                setVisible(false);
                console.log(
                  "looking for a place to use framer on this project",
                );
              }}
            >
              <CircleX />
            </button>
          </Alert>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
