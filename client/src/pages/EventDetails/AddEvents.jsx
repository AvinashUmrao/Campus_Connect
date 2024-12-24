'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock, Upload, MapPin } from 'lucide-react'

export default function AddEventForm() {
    const [description, setDescription] = useState('')
    const [date, setDate] = useState()
    const [time, setTime] = useState('')
    const [location, setLocation] = useState('')
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Here you would typically send the form data to your backend
        console.log({
            description,
            date,
            time,
            location,
            month: date ? date.getMonth() + 1 : null, // Adding 1 because getMonth() returns 0-11
            year: date ? date.getFullYear() : null,
            image
        })
        // Reset form after submission
        setDescription('')
        setDate(undefined)
        setTime('')
        setLocation('')
        setImage(null)
        setImagePreview(null)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow">
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter event description"
                    required
                />
            </div>

            <div>
                <Label>Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div>
                <Label htmlFor="time">Time</Label>
                <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="pl-10"
                        required
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter event location"
                        className="pl-10"
                        required
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="image">Event Image</Label>
                <div className="mt-1 flex items-center">
                    <Input
                        id="image"
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <Label htmlFor="image" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Upload className="h-5 w-5 mr-2" />
                        Upload Image
                    </Label>
                </div>
                {imagePreview && (
                    <div className="mt-2">
                        <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded" />
                    </div>
                )}
            </div>

            <Button type="submit" className="w-full">Add Event</Button>
        </form>
    )
}
