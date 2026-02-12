import svgPaths from "./svg-un4wpyzobk";
import imgGif1 from "figma:asset/83e27eee6a98394ff19721461cf767c6f0223b83.png";
import imgFrame11 from "figma:asset/c7f04dc4b4d07267dea987029d332b82da2c64b4.png";
import imgEllipse2 from "figma:asset/f05a5384e8a5737f146a98a2384fcb40781274a7.png";
import imgEllipse3 from "figma:asset/7b2c4fa4410992af3b6b3ba2b810250ea72fed6f.png";

function Frame() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[20px] left-[21px] overflow-clip top-0 w-[181px]">
      <div className="absolute font-['Roboto:Regular',sans-serif] font-normal h-[20px] leading-[19.5px] left-0 text-[15px] text-[rgba(255,255,255,0.9)] top-0 w-[495px] whitespace-pre-wrap" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="mb-0">Avicii Tribute Concert - Waiting For Love (Live Vocals by Simon Aldred)</p>
        <p>&nbsp;</p>
      </div>
    </div>
  );
}

function Music() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Music">
      <div className="absolute left-0 size-[12px] top-[4px]" data-name="Music Icon">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <path clipRule="evenodd" d={svgPaths.p3f908200} fill="var(--fill-0, white)" fillRule="evenodd" id="Music Icon" />
        </svg>
      </div>
      <Frame />
    </div>
  );
}

function SongTitleMarqueeAnimation() {
  return (
    <div className="absolute h-[20px] left-[11.5px] overflow-clip top-[784.5px] w-[202px]" data-name="song title marquee animation 1">
      <Music />
    </div>
  );
}

function FloatingTones() {
  return (
    <div className="absolute h-[82.765px] left-[23.5px] top-[30.39px] w-[58.054px]" data-name="Floating Tones">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 58.0538 82.7648">
        <g id="Floating Tones">
          <g id="no33" opacity="0.6" />
          <g id="no22" opacity="0.6" />
          <g id="no11" opacity="0.5" />
          <path d={svgPaths.p2e2fe100} fill="var(--fill-0, white)" id="no3" opacity="0.6" />
          <path d={svgPaths.p501f600} fill="var(--fill-0, white)" id="no2" opacity="0.6" />
          <path d={svgPaths.p17802200} fill="var(--fill-0, white)" id="no1" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

function Notes() {
  return (
    <div className="absolute h-[107px] left-[292.5px] top-[676.5px] w-[77px]" data-name="notes">
      <FloatingTones />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute left-0 size-[49px] top-0">
      <img alt="" className="block max-w-none size-full" height="49" src={imgFrame11} width="49" />
      <div className="absolute flex inset-[11.06%] items-center justify-center">
        <div className="flex-none rotate-[133.12deg] size-[27px]">
          <div className="relative size-full">
            <img alt="" className="block max-w-none size-full" height="27" src={imgEllipse2} width="27" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Disc() {
  return (
    <div className="absolute left-[358.41px] size-[49px] top-[749.11px]" data-name="Disc">
      <Frame1 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute h-[32.359px] left-[13.75px] top-[15.32px] w-[35.5px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.5 32.3591">
        <g id="Group 6">
          <path d={svgPaths.p3049b080} id="Line 2" stroke="var(--stroke-0, #C33E4F)" strokeLinecap="round" strokeWidth="3" />
          <path d={svgPaths.p26615c80} id="Line 4" stroke="var(--stroke-0, #C33E4F)" strokeLinecap="round" strokeWidth="3" />
          <path d={svgPaths.p1960c740} id="Line 6" stroke="var(--stroke-0, #C33E4F)" strokeLinecap="round" strokeWidth="3" />
          <path d={svgPaths.p1292d660} id="Line 8" stroke="var(--stroke-0, #C33E4F)" strokeLinecap="round" strokeWidth="3" />
          <path d={svgPaths.p100e7f80} id="Line 3" stroke="var(--stroke-0, #C33E4F)" strokeLinecap="round" strokeWidth="3" />
          <path d={svgPaths.p18f371c0} id="Line 5" stroke="var(--stroke-0, #C33E4F)" strokeLinecap="round" strokeWidth="3" />
          <path d={svgPaths.p3ccc2e80} id="Line 7" stroke="var(--stroke-0, #C33E4F)" strokeLinecap="round" strokeWidth="3" />
          <path d={svgPaths.p18bd0d50} id="Line 9" stroke="var(--stroke-0, #C33E4F)" strokeLinecap="round" strokeWidth="3" />
          <g id="Group 4">
            <path d={svgPaths.p248e1c00} fill="var(--fill-0, white)" id="Union" />
            <g id="Union_2" opacity="0.8" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Heart() {
  return (
    <div className="absolute left-[352px] size-[63px] top-[492.5px]" data-name="heart1">
      <Group />
    </div>
  );
}

function Info() {
  return (
    <div className="absolute contents font-['Roboto:Black',sans-serif] font-black left-[12px] text-white top-[727px]" data-name="Info">
      <p className="absolute leading-[0] left-[12px] text-[0px] top-[727px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <span className="leading-[normal] text-[17px]">@karennne</span>
        <span className="leading-[normal] text-[17px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "\'wdth\' 100" }}>{` · `}</span>
        <span className="leading-[normal] text-[15px] text-[rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
          1-28
        </span>
      </p>
      <p className="absolute leading-[19.5px] left-[12px] text-[15px] top-[756px] w-[332px] whitespace-pre-wrap" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        #avicii #wflove
      </p>
    </div>
  );
}

function ShareIcon() {
  return (
    <div className="absolute h-[26.841px] left-[366.25px] opacity-90 top-[670.5px] w-[34.079px]" data-name="Share Icon">
      <div className="absolute inset-[-13.67%_-11.74%_-16.13%_-11.74%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42.0786 34.8412">
          <g filter="url(#filter0_d_2_268)" id="Share Icon">
            <path d={svgPaths.p17244480} fill="var(--fill-0, #FBFBFB)" id="Union" />
            <path d={svgPaths.p2d447800} fill="var(--fill-0, white)" id="Union_2" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="34.8412" id="filter0_d_2_268" width="42.0786" x="6.38762e-10" y="1.99712e-07">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="0.33" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2_268" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2_268" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Shares() {
  return (
    <div className="absolute contents left-[366.25px] top-[670.5px]" data-name="Shares">
      <ShareIcon />
      <p className="-translate-x-1/2 absolute font-['Roboto:Black',sans-serif] font-black leading-[normal] left-[384px] opacity-90 text-[13px] text-center text-shadow-[1px_1px_0px_rgba(0,0,0,0.3)] text-white top-[706px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Share
      </p>
    </div>
  );
}

function MessageIcon() {
  return (
    <div className="absolute h-[33.226px] left-[366px] opacity-90 top-[590.5px] w-[35px]" data-name="Message Icon">
      <div className="absolute inset-[-11.05%_-11.43%_-13.03%_-11.43%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 43 41.2262">
          <g filter="url(#filter0_d_2_264)" id="Message Icon">
            <path clipRule="evenodd" d={svgPaths.p22da8500} fill="var(--fill-0, #FBFBFB)" fillRule="evenodd" id="Union" />
            <path clipRule="evenodd" d={svgPaths.pb3ce900} fill="var(--fill-0, white)" fillRule="evenodd" id="Subtract" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="41.2262" id="filter0_d_2_264" width="43" x="0" y="8.9407e-08">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="0.33" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2_264" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2_264" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Comments() {
  return (
    <div className="absolute contents left-[366px] top-[590.5px]" data-name="Comments">
      <p className="-translate-x-1/2 absolute font-['Roboto:Black',sans-serif] font-black leading-[normal] left-[383.5px] opacity-90 text-[13px] text-center text-shadow-[1px_1px_0px_rgba(0,0,0,0.3)] text-white top-[629px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        64
      </p>
      <MessageIcon />
    </div>
  );
}

function Likes() {
  return (
    <div className="absolute contents left-[368.5px] top-[552px]" data-name="Likes">
      <p className="-translate-x-1/2 absolute font-['Roboto:Black',sans-serif] font-black leading-[normal] left-[384px] opacity-90 text-[13px] text-center text-shadow-[1px_1px_0px_rgba(0,0,0,0.3)] text-white top-[552px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        4445
      </p>
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="absolute contents left-[366px] top-[552px]" data-name="Action Buttons">
      <Shares />
      <Comments />
      <Likes />
    </div>
  );
}

function User() {
  return (
    <div className="absolute contents left-[360px] top-[433px]" data-name="User">
      <div className="absolute left-[360px] size-[47px] top-[433px]">
        <div className="absolute inset-[-2.13%]">
          <img alt="" className="block max-w-none size-full" height="49" src={imgEllipse3} width="49" />
        </div>
      </div>
    </div>
  );
}

function ButtonShape() {
  return (
    <div className="absolute h-[28px] left-[185.5px] top-[8.5px] w-[43px]" data-name="Button Shape">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 43 28">
        <g id="Button Shape">
          <rect fill="var(--fill-0, #E6436D)" height="28" id="Rectangle 3" rx="8" width="36" x="7" />
          <rect fill="var(--fill-0, #65D2E9)" height="28" id="Rectangle 2" rx="8" width="36" />
          <rect fill="var(--fill-0, white)" height="28" id="Rectangle 1" rx="8" width="36" x="3.5" />
          <path d={svgPaths.p3b23d980} fill="var(--fill-0, #161722)" id="Plus Icon" />
        </g>
      </svg>
    </div>
  );
}

function Home() {
  return (
    <div className="absolute contents left-[27.5px] top-[7px]" data-name="Home">
      <div className="absolute h-[20.925px] left-[29.5px] top-[7px] w-[23.242px]" data-name="Home Solid Icon">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.2419 20.9246">
          <path clipRule="evenodd" d={svgPaths.p329dbf00} fill="var(--fill-0, white)" fillRule="evenodd" id="Home Solid Icon" />
        </svg>
      </div>
      <p className="absolute font-['Roboto:Black',sans-serif] font-black leading-[normal] left-[27.5px] text-[10px] text-white top-[32.5px] tracking-[0.15px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Home
      </p>
    </div>
  );
}

function Discover() {
  return (
    <div className="absolute contents left-[104.5px] top-[7px]" data-name="Discover">
      <div className="absolute h-[20.852px] left-[114px] opacity-80 top-[7px] w-[20.438px]" data-name="Search Icon">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.438 20.8523">
          <path clipRule="evenodd" d={svgPaths.p4985800} fill="var(--fill-0, white)" fillRule="evenodd" id="Search Icon" />
        </svg>
      </div>
      <p className="absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[104.5px] opacity-80 text-[10px] text-white top-[32.5px] tracking-[0.15px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Discover
      </p>
    </div>
  );
}

function Inbox() {
  return (
    <div className="absolute contents left-[276.5px] top-[8px]" data-name="Inbox">
      <div className="absolute h-[20.529px] left-[280px] opacity-80 top-[8px] w-[20px]" data-name="Message Stroke Icon">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20.5285">
          <g id="Message Stroke Icon">
            <path d={svgPaths.p4712b00} fill="var(--fill-0, white)" />
            <path clipRule="evenodd" d={svgPaths.p6c3c480} fill="var(--fill-0, white)" fillRule="evenodd" />
          </g>
        </svg>
      </div>
      <p className="-translate-x-1/2 absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[289.5px] opacity-80 text-[10px] text-center text-white top-[32.5px] tracking-[0.15px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Inbox
      </p>
    </div>
  );
}

function Me() {
  return (
    <div className="absolute contents left-[363.5px] top-[7px]" data-name="Me">
      <div className="absolute h-[20.683px] left-[363.5px] opacity-80 top-[7px] w-[18.216px]" data-name="Account Stroke Icon">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.2163 20.6828">
          <g id="Account Stroke Icon">
            <path clipRule="evenodd" d={svgPaths.pdac1500} fill="var(--fill-0, white)" fillRule="evenodd" />
            <path d={svgPaths.p1d001880} fill="var(--fill-0, white)" />
          </g>
        </svg>
      </div>
      <p className="-translate-x-1/2 absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[373.5px] opacity-80 text-[10px] text-center text-white top-[32.5px] tracking-[0.15px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Me
      </p>
    </div>
  );
}

function TabBar() {
  return (
    <div className="absolute h-[83px] left-0 overflow-clip top-[813px] w-[414px]" data-name="Tab Bar">
      <div className="absolute bg-black h-[82.67px] left-0 shadow-[0px_-0.33px_0px_0px_#262626] top-[0.33px] w-[414px]" data-name="Background" />
      <ButtonShape />
      <Home />
      <Discover />
      <Inbox />
      <Me />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute h-[44px] left-0 overflow-clip top-[44px] w-[414px]" data-name="Header">
      <p className="-translate-x-1/2 absolute font-['Roboto:Black',sans-serif] font-black leading-[normal] left-[167px] text-[16px] text-center text-white top-[13px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Following
      </p>
      <p className="-translate-x-1/2 absolute font-['Roboto:Black',sans-serif] font-black leading-[normal] left-[254.5px] text-[18px] text-[rgba(255,255,255,0.6)] text-center top-[11px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        For You
      </p>
      <div className="absolute h-[11px] left-[214.5px] top-[16.5px] w-0">
        <div className="absolute inset-[-4.55%_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 12">
            <path d="M0.5 11.5V0.5" id="Vector 1" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeOpacity="0.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function BarsHomeIndicator() {
  return (
    <div className="absolute h-[35px] left-0 overflow-clip top-[861px] w-[414px]" data-name="Bars / Home Indicator">
      <div className="absolute inset-[-2.86%_0_2.86%_0]" data-name="⬛ Background" />
      <div className="-translate-x-1/2 absolute bg-[#e9e9e9] bottom-[10px] h-[5px] left-1/2 rounded-[100px] w-[134px]" data-name="Line" />
    </div>
  );
}

function Battery() {
  return (
    <div className="-translate-y-1/2 absolute h-[10.5px] right-[14.5px] top-[calc(50%+0.25px)] w-[24.5px]" data-name="Battery">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.5 10.5">
        <g id="Battery">
          <path d={svgPaths.p12240232} fill="var(--fill-0, #ABABAB)" id="Combined Shape" />
          <path d={svgPaths.p1fe00b00} fill="var(--fill-0, #ABABAB)" id="Combined Shape_2" />
          <rect fill="var(--fill-0, white)" height="6.5" id="Rectangle" rx="1" width="18" x="2" y="2" />
        </g>
      </svg>
    </div>
  );
}

function TimeStyle() {
  return (
    <div className="absolute inset-[29.55%_80%_29.55%_5.6%] overflow-clip" data-name="Time Style">
      <p className="absolute font-['SF_Pro_Text:Semibold',sans-serif] leading-[normal] left-0 not-italic right-[-0.38px] text-[15px] text-center text-white top-[calc(50%-9px)] tracking-[-0.3px] whitespace-pre-wrap">9:41</p>
    </div>
  );
}

function BarsStatusBarIPhoneX() {
  return (
    <div className="absolute h-[44px] left-0 overflow-clip top-0 w-[414px]" data-name="Bars / Status Bar / iPhone X">
      <div className="absolute inset-[-2.27%_0_2.27%_0]" data-name="⬛ Background" />
      <Battery />
      <div className="absolute inset-[37.11%_11.74%_37.96%_84.18%]" data-name="Wifi">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.8607 10.9656">
          <path clipRule="evenodd" d={svgPaths.pbb13780} fill="var(--fill-0, white)" fillRule="evenodd" id="Wifi" />
        </svg>
      </div>
      <div className="absolute inset-[37.88%_17.16%_37.88%_78.31%]" data-name="Mobile Signal">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.768 10.6667">
          <path clipRule="evenodd" d={svgPaths.p3d642180} fill="var(--fill-0, white)" fillRule="evenodd" id="Mobile Signal" />
        </svg>
      </div>
      <TimeStyle />
    </div>
  );
}

export default function TikTokHomeFollowing() {
  return (
    <div className="relative size-full" data-name="TikTok Home (Following)">
      <div className="absolute h-[896px] left-0 top-0 w-[414px]" data-name="gif1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgGif1} />
      </div>
      <SongTitleMarqueeAnimation />
      <Notes />
      <Disc />
      <Heart />
      <Info />
      <ActionButtons />
      <User />
      <TabBar />
      <Header />
      <BarsHomeIndicator />
      <BarsStatusBarIPhoneX />
      <div className="absolute h-[897px] left-0 top-[-0.5px] w-[414px]" data-name="Rectangle" />
    </div>
  );
}