"use client";

import { CornerDownLeft, Mic, Paperclip } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function Component() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            Current Machine:{" "}
            <Select defaultValue="1">
              <SelectTrigger className="inline w-auto">
                <SelectValue placeholder="Select Machine" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Machine</SelectLabel>
                  <SelectItem value="1">AO:PACK</SelectItem>
                  <SelectItem value="2">Guillotine</SelectItem>
                  <SelectItem value="3">Machine 3</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid justify-end gap-8">
          <div className="flex items-center justify-end gap-4">
            <div className="rounded-md bg-muted px-10 py-5 font-medium">
              Hello World!
            </div>
            <div className="grid gap-1 text-right">
              <p className="text-sm font-medium leading-none">Jed Borseth</p>
              <p className="text-sm text-muted-foreground">Guillotine</p>
            </div>
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback>JB</AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>

      <form className="relative m-5 overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Paperclip className="size-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach File</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Mic className="size-4" />
                  <span className="sr-only">Use Microphone</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Use Microphone</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button type="submit" size="sm" className="ml-auto gap-1.5">
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
