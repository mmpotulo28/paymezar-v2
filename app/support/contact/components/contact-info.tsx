"use client";
import React from "react";
import { Card, CardBody, Link, Button } from "@heroui/react";
import {
  Clock,
  Facebook,
  Inbox,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

export function ContactInfo() {
  return (
    <Card>
      <CardBody className="flex flex-col gap-6">
        <div className="flex items-start gap-3">
          <Button isIconOnly className="text-default-500" variant="light">
            <MapPin size={16} />
          </Button>
          <div>
            <h3 className="text-lg font-semibold">Office Location</h3>
            <p className="text-default-500">
              PayMe-Zar HQ
              <br />
              123 Fintech Avenue
              <br />
              Johannesburg, South Africa
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Button isIconOnly className="text-default-500" variant="light">
            <Phone size={16} />
          </Button>
          <div>
            <h3 className="text-lg font-semibold">Phone</h3>
            <Link color="foreground" href="tel:+27110000000">
              +27 11 000 0000
            </Link>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Button isIconOnly className="text-default-500" variant="light">
            <Inbox size={16} />
          </Button>
          <div>
            <h3 className="text-lg font-semibold">Email</h3>
            <Link color="foreground" href="mailto:support@paymezar.com">
              support@paymezar.com
            </Link>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Button isIconOnly className="text-default-500" variant="light">
            <Clock size={16} />
          </Button>
          <div>
            <h3 className="text-lg font-semibold">Business Hours</h3>
            <p className="text-default-500">
              Monday - Friday: 8:00 AM - 6:00 PM
              <br />
              Saturday - Sunday: Closed
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <Button
            isExternal
            isIconOnly
            as={Link}
            href="https://facebook.com/paymezar"
            variant="light"
          >
            <Facebook className="text-default-500" size={16} />
          </Button>
          <Button
            isExternal
            isIconOnly
            as={Link}
            href="https://twitter.com/mmpotulo"
            variant="light"
          >
            <Twitter className="text-default-500" size={16} />
          </Button>
          <Button
            isExternal
            isIconOnly
            as={Link}
            href="https://linkedin.com/company/paymezar"
            variant="light"
          >
            <Linkedin className="text-default-500" size={16} />
          </Button>
          <Button
            isExternal
            isIconOnly
            as={Link}
            href="https://instagram.com/paymezar"
            variant="light"
          >
            <Instagram className="text-default-500" size={16} />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
