"use client";
import Link from "next/link";

export default function Nav() {
  const linkCls = "hover:underline";
  return (
    <nav style={{display:"flex", gap:"1rem", padding:"0.75rem 0"}}>
      <Link className={linkCls} href="/">Home</Link>
      <Link className={linkCls} href="/about">About</Link>
      <Link className={linkCls} href="/contacts">Contacts</Link>
      <Link className={linkCls} href="/articles">Articles</Link>
    </nav>
  );
}
