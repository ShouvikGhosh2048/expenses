"use client"

// https://stackoverflow.com/a/77474357

export default function ClientDate(props: { date: Date }) {
    return <>{props.date.toLocaleString()}</>;
}