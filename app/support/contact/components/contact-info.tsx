"use client";
import React from "react";
import { Card, CardBody, Link, Button } from "@heroui/react";
import { Clock, Facebook, Inbox, Instagram, Linkedin, MapPin, Phone, Twitter } from "lucide-react";

export function ContactInfo() {
	return (
		<Card>
			<CardBody className="flex flex-col gap-6">
				<div className="flex items-start gap-3">
					<Button isIconOnly variant="light" className="text-default-500">
						<MapPin size={16} />
					</Button>
					<div>
						<h3 className="text-lg font-semibold">Office Location</h3>
						<p className="text-default-500">
							123 Business Street
							<br />
							Suite 100
							<br />
							San Francisco, CA 94107
						</p>
					</div>
				</div>

				<div className="flex items-start gap-3">
					<Button isIconOnly variant="light" className="text-default-500">
						<Phone size={16} />
					</Button>
					<div>
						<h3 className="text-lg font-semibold">Phone</h3>
						<Link href="tel:+1234567890" color="foreground">
							(123) 456-7890
						</Link>
					</div>
				</div>

				<div className="flex items-start gap-3">
					<Button isIconOnly variant="light" className="text-default-500">
						<Inbox size={16} />
					</Button>
					<div>
						<h3 className="text-lg font-semibold">Email</h3>
						<Link href="mailto:contact@company.com" color="foreground">
							contact@company.com
						</Link>
					</div>
				</div>

				<div className="flex items-start gap-3">
					<Button isIconOnly variant="light" className="text-default-500">
						<Clock size={16} />
					</Button>
					<div>
						<h3 className="text-lg font-semibold">Business Hours</h3>
						<p className="text-default-500">
							Monday - Friday: 9:00 AM - 5:00 PM
							<br />
							Saturday - Sunday: Closed
						</p>
					</div>
				</div>

				<div className="flex gap-4 mt-4">
					<Button isIconOnly variant="light" as={Link} href="#" isExternal>
						<Facebook size={16} className="text-default-500" />
					</Button>
					<Button isIconOnly variant="light" as={Link} href="#" isExternal>
						<Twitter size={16} className="text-default-500" />
					</Button>
					<Button isIconOnly variant="light" as={Link} href="#" isExternal>
						<Linkedin size={16} className="text-default-500" />
					</Button>
					<Button isIconOnly variant="light" as={Link} href="#" isExternal>
						<Instagram size={16} className="text-default-500" />
					</Button>
				</div>
			</CardBody>
		</Card>
	);
}
