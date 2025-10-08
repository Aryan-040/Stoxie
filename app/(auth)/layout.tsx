//user server 
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if(session?.user) redirect('/')
  return (
    <main className="auth-layout">
      <section className="auth-left-section scrollbar-hide default">
        <Link href="/" className="auth-logo">
          <div className="flex items-center space-x-3">
            <Image
              src="/assets/icons/logo.svg"
              alt="Stoxie icon"
              width={32}
              height={32}
              className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
              Stoxie
            </span>
          </div>
        </Link>
        <div className="pb-6 lg:pb-8 flex-1">{children}</div>
      </section>
      <section className="auth-right-section">
        <div className="z-10 relative lg:mt-4 lg:mb-16">
          <blockquote className="auth-blockquote">
            With Stoxie, my watchlist isn’t just a list—it’s a roadmap to
            winning trades. I finally trade with confidence
          </blockquote>
          <div className="flex items-center justify-between">
            <div>
              <cite className="auth-testimonial-author">-Aryan M. Singh</cite>
              <p className="max-md:text-xs text-gray-500">Investor</p>
            </div>

            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Image
                  src="/assets/icons/star.svg"
                  alt="Star"
                  key={star}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 relative">
          <Image
            src="/assets/images/dashboard.png"
            alt="Dashboard Preview"
            width={1024}
            height={600}
            className="auth-dashboard-preview"
          />
        </div>
      </section>
    </main>
  );
};
export default Layout;
