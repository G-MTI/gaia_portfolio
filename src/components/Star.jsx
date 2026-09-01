
import { lazy, Suspense } from "react"

const Spline = lazy(() => import("@splinetool/react-spline"))

export default function Star() {
  return (
    <Suspense fallback={null}>
      <Spline scene="https://prod.spline.design/tCkeyvgG7h-dJnbN/scene.splinecode" />
    </Suspense>
  )
}