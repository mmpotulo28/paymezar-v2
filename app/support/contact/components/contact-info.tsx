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
							PayMe-Zar HQ
							<br />
							123 Fintech Avenue
							<br />
							Johannesburg, South Africa
						</p>
					</div>
				</div>

				<div className="flex items-start gap-3">
					<Button isIconOnly variant="light" className="text-default-500">
						<Phone size={16} />
					</Button>
					<div>
						<h3 className="text-lg font-semibold">Phone</h3>
						<Link href="tel:+27110000000" color="foreground">
							+27 11 000 0000
						</Link>
					</div>
				</div>

				<div className="flex items-start gap-3">
					<Button isIconOnly variant="light" className="text-default-500">
						<Inbox size={16} />
					</Button>
					<div>
						<h3 className="text-lg font-semibold">Email</h3>
						<Link href="mailto:support@paymezar.com" color="foreground">
							support@paymezar.com
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
							Monday - Friday: 8:00 AM - 6:00 PM
							<br />
							Saturday - Sunday: Closed
						</p>
					</div>
				</div>

				<div className="flex gap-4 mt-4">
					<Button
						isIconOnly
						variant="light"
						as={Link}
						href="https://facebook.com/paymezar"
						isExternal>
						<Facebook size={16} className="text-default-500" />
					</Button>
					<Button
						isIconOnly
						variant="light"
						as={Link}
						href="https://twitter.com/mmpotulo"
						isExternal>
						<Twitter size={16} className="text-default-500" />
					</Button>
					<Button
						isIconOnly
						variant="light"
						as={Link}
						href="https://linkedin.com/company/paymezar"
						isExternal>
						<Linkedin size={16} className="text-default-500" />
					</Button>
					<Button
						isIconOnly
						variant="light"
						as={Link}
						href="https://instagram.com/paymezar"
						isExternal>
						<Instagram size={16} className="text-default-500" />
					</Button>
				</div>
			</CardBody>
		</Card>
	);
}
