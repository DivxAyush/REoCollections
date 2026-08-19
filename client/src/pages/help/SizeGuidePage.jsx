import Container from '@/components/ui/Container'
import { Ruler } from 'lucide-react'

export default function SizeGuidePage() {
  return (
    <div className="bg-white py-12 lg:py-20 min-h-[calc(100vh-200px)]">
      <Container className="max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#F7F7F6] mb-6">
            <Ruler className="h-8 w-8 text-[#C9AD8B]" />
          </div>
          <h1 className="font-['Outfit'] text-3xl font-bold tracking-tight text-[#111111] sm:text-5xl">
            Size Guide
          </h1>
          <p className="mt-6 text-lg text-[#5F5F5F] max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive measuring guide and size charts designed specifically for REo Collection apparel.
          </p>
        </div>

        {/* How to measure section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1 space-y-8">
            <h2 className="font-['Outfit'] text-2xl font-bold text-[#111111]">How to Measure</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-[#111111] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111111] text-xs text-white flex-shrink-0">1</span>
                  Chest
                </h3>
                <p className="mt-2 text-[#5F5F5F] ml-8">Measure around the fullest part of your chest, keeping the tape horizontal and comfortably loose.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-[#111111] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111111] text-xs text-white flex-shrink-0">2</span>
                  Waist
                </h3>
                <p className="mt-2 text-[#5F5F5F] ml-8">Measure around the narrowest part of your waistline (typically where your body bends side to side). Don't hold your breath while measuring.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-[#111111] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111111] text-xs text-white flex-shrink-0">3</span>
                  Hips
                </h3>
                <p className="mt-2 text-[#5F5F5F] ml-8">Stand with your feet together and measure around the fullest part of your hips, keeping the tape horizontal.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#111111] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111111] text-xs text-white flex-shrink-0">4</span>
                  Shoulder & Sleeve
                </h3>
                <p className="mt-2 text-[#5F5F5F] ml-8">For shoulder, measure across the back from shoulder seam to shoulder seam. For sleeve, measure from the shoulder seam down to the wrist bone.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#111111] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111111] text-xs text-white flex-shrink-0">5</span>
                  Inseam
                </h3>
                <p className="mt-2 text-[#5F5F5F] ml-8">Measure from the top of the inner thigh down to the bottom of the ankle.</p>
              </div>
            </div>
            
            <div className="rounded-xl bg-[#F7F7F6] p-6 border border-[#E5E5E3]">
              <p className="text-sm text-[#5F5F5F] leading-relaxed">
                <strong className="text-[#111111]">Pro Tip:</strong> For the most accurate results, measure yourself in your undergarments. If your measurements fall between two sizes, we recommend selecting the larger size for a looser fit, or the smaller size for a tighter, more tailored fit.
              </p>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 bg-[#F7F7F6] rounded-3xl p-6 lg:p-10 flex items-center justify-center border border-[#E5E5E3]">
            {/* Using a placeholder fashion measuring image */}
            <div className="relative group overflow-hidden rounded-2xl shadow-xl w-full">
              <img 
                src="/images/size-guide.jpg" 
                alt="Minimalist line art showing male body measurement points: Chest, Waist, Hips, Shoulder, Inseam, Sleeve" 
                className="w-full h-full object-cover aspect-[4/5] transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Men's Size Chart */}
        <div className="mb-16">
          <h2 className="font-['Outfit'] text-2xl font-bold text-[#111111] mb-6">Men's Apparel (Inches)</h2>
          <div className="overflow-x-auto rounded-xl border border-[#E5E5E3] shadow-sm">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F7F7F6] text-[#111111] border-b border-[#E5E5E3]">
                <tr>
                  <th className="px-6 py-5 font-semibold">Size</th>
                  <th className="px-6 py-5 font-semibold">Chest</th>
                  <th className="px-6 py-5 font-semibold">Waist</th>
                  <th className="px-6 py-5 font-semibold">Hips</th>
                  <th className="px-6 py-5 font-semibold">Shoulder</th>
                  <th className="px-6 py-5 font-semibold">Inseam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E3]">
                <tr className="hover:bg-[#F7F7F6]/50 transition-colors">
                  <td className="px-6 py-5 font-medium text-[#111111]">S</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">36 - 38</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">29 - 31</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">35 - 37</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">17</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">31</td>
                </tr>
                <tr className="hover:bg-[#F7F7F6]/50 transition-colors">
                  <td className="px-6 py-5 font-medium text-[#111111]">M</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">39 - 41</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">32 - 34</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">38 - 40</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">18</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">32</td>
                </tr>
                <tr className="hover:bg-[#F7F7F6]/50 transition-colors">
                  <td className="px-6 py-5 font-medium text-[#111111]">L</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">42 - 44</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">35 - 37</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">41 - 43</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">19</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">33</td>
                </tr>
                <tr className="hover:bg-[#F7F7F6]/50 transition-colors">
                  <td className="px-6 py-5 font-medium text-[#111111]">XL</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">45 - 48</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">38 - 41</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">44 - 46</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">20</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">34</td>
                </tr>
                <tr className="hover:bg-[#F7F7F6]/50 transition-colors">
                  <td className="px-6 py-5 font-medium text-[#111111]">XXL</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">49 - 52</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">42 - 45</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">47 - 49</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">21</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">34</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footwear Size Chart */}
        <div>
          <h2 className="font-['Outfit'] text-2xl font-bold text-[#111111] mb-6">Men's Footwear</h2>
          <div className="overflow-x-auto rounded-xl border border-[#E5E5E3] shadow-sm">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F7F7F6] text-[#111111] border-b border-[#E5E5E3]">
                <tr>
                  <th className="px-6 py-5 font-semibold">UK / India</th>
                  <th className="px-6 py-5 font-semibold">US</th>
                  <th className="px-6 py-5 font-semibold">EU</th>
                  <th className="px-6 py-5 font-semibold">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E3]">
                <tr className="hover:bg-[#F7F7F6]/50 transition-colors">
                  <td className="px-6 py-5 font-medium text-[#111111]">6</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">7</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">40</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">25.0</td>
                </tr>
                <tr className="hover:bg-[#F7F7F6]/50 transition-colors">
                  <td className="px-6 py-5 font-medium text-[#111111]">7</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">8</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">41</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">26.0</td>
                </tr>
                <tr className="hover:bg-[#F7F7F6]/50 transition-colors">
                  <td className="px-6 py-5 font-medium text-[#111111]">8</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">9</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">42</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">27.0</td>
                </tr>
                <tr className="hover:bg-[#F7F7F6]/50 transition-colors">
                  <td className="px-6 py-5 font-medium text-[#111111]">9</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">10</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">43</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">28.0</td>
                </tr>
                <tr className="hover:bg-[#F7F7F6]/50 transition-colors">
                  <td className="px-6 py-5 font-medium text-[#111111]">10</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">11</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">44</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">29.0</td>
                </tr>
                <tr className="hover:bg-[#F7F7F6]/50 transition-colors">
                  <td className="px-6 py-5 font-medium text-[#111111]">11</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">12</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">45</td>
                  <td className="px-6 py-5 text-[#5F5F5F]">30.0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </div>
  )
}
