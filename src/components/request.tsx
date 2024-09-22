"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { capsFirst } from "~/lib/utils";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import Pusher from "pusher-js";
import { Card } from "./ui/card";
import { useUser } from "@clerk/nextjs";

const RequestSomething = ({ event }: { event: string }) => {
  const user = useUser();
  const { handleSubmit } = useForm();
  const router = useRouter();
  const FormSchema = z.object({
    request: z.string(),
    machine: z.string().optional().nullable(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  useEffect(() => {
    // Initialize Pusher ensure there is only one instance
    Pusher.instances.length === 0 && initPusher();
  }, []);

  const initPusher = () => {
    Pusher.logToConsole = true;
    const pusher = new Pusher("45f8563d745fc657c5c5", {
      cluster: "us3",
    });

    const channel = pusher.subscribe("requests");

    channel.bind(event, function (data: string) {
      alert(JSON.stringify(data));
    });
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const req = await fetch("/dashboard/sendMaterialRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, user }),
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const res = await req.json();
    console.log(res);
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Make A Material Request</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a Request</DialogTitle>
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-6 max-sm:text-base"
                >
                  <FormField
                    control={form.control}
                    name="request"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Request</FormLabel>
                        <FormControl>
                          <Input
                            onChange={field.onChange}
                            placeholder="80x120 48BC"
                            type="text"
                            inputMode="numeric"
                            defaultValue={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="machine"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Machine</FormLabel>
                        <FormControl>
                          <Input
                            onChange={field.onChange}
                            placeholder="Where is material needed? e.g. (AOPACK, Sheeter, etc.)"
                            type="text"
                            inputMode="numeric"
                            required={false}
                            defaultValue={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.formState.isValid ? (
                    <DialogClose type="submit" asChild>
                      <Button type="submit">Request</Button>
                    </DialogClose>
                  ) : (
                    <Button type="submit">Request</Button>
                  )}
                </form>
              </Form>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RequestSomething;
