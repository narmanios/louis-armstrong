import svgPaths from './svg-j11evzkvwo';
import imgTheRealAmbassadors5Bonus2 from '../../images/album.png';

function Guides() {
  return (
    <div
      className="absolute content-stretch flex items-center left-[30px] top-[30px] w-[120px]"
      data-name="guides"
    >
      <div className="bg-[#E9E6D9] h-[740px] shrink-0 w-[406px]" />
      <div className="bg-[#f9f9f9] h-[740px] shrink-0 w-[406px]" />
      <div className="bg-[#E9E6D9] h-[740px] shrink-0 w-[406px]" />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[7.99%_6.03%_89.49%_92.39%]" data-name="Group">
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20.2041 20.2041"
      >
        <g id="Group">
          <path d={svgPaths.p4cf8a70} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[7.99%_6.03%_89.49%_92.39%]" data-name="Group">
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20.2041 20.204"
      >
        <g id="Group">
          <path d={svgPaths.p314a7300} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[7.38%_5.65%_88.88%_92.01%]" data-name="Group">
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 30 30"
      >
        <g id="Group">
          <path d={svgPaths.p61df080} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[7.38%_5.65%_88.88%_92.01%]" data-name="Group">
      <Group1 />
      <Group2 />
      <Group3 />
    </div>
  );
}

function Close() {
  return (
    <button
      className="absolute contents cursor-pointer inset-[7.38%_5.65%_88.88%_92.01%]"
      data-name="Close"
    >
      <Group />
    </button>
  );
}

export default function OverlayAmbassadorSatch() {
  return (
    <div className="relative size-full" data-name="Overlay: Ambassador Satch">
      <div className="absolute bg-[#f5f3ea] h-[740px] left-[30px] top-[30px] w-[1220px]" />
      <Guides />
      <p className="absolute font-['Helvetica_Neue:Regular',sans-serif] h-[181px] leading-[22px] left-[74px] not-italic text-[12px] text-black top-[482px] w-[268px]">
        Ambassador Satch was a 1956 album that helped present Louis Armstrong as a global symbol of
        jazz and international goodwill. Built from recordings from his 1955 European tour, the
        album supported the image of Armstrong as “Ambassador Satch,” a nickname tied to his growing
        role as America’s musical envoy abroad.
      </p>
      <p className="absolute font-['Helvetica_Neue:Medium',sans-serif] h-[42px] leading-[normal] left-[calc(50%-570.15px)] not-italic text-[24px] text-black top-[72px] w-[410px]">
        Ambassador Satch
      </p>
      <div
        className="-translate-x-1/2 absolute left-[calc(50%-414.15px)] pointer-events-none size-[306px] top-[161px]"
        data-name="the-real-ambassadors-5-bonus 2"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover size-full"
          src={imgTheRealAmbassadors5Bonus2}
        />
        <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0" />
      </div>
      {/* <Close /> */}
    </div>
  );
}
