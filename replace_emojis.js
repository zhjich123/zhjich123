const fs = require('fs');
const path = '/workspace/media-sniffer-v1.0.6.user.js';
let content = fs.readFileSync(path, 'utf8');

// =========================================================================
// SVG icon definitions
// =========================================================================
const svgs = {
    chevronLeft: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.2));"><polyline points="15 18 9 12 15 6"></polyline></svg>',
    play: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.25));"><polygon points="5 3 21 12 5 21 5 3"></polygon></svg>',
    playSmall: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block;vertical-align:middle;"><polygon points="5 3 21 12 5 21 5 3"></polygon></svg>',
    music: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.25));"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
    target: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.35));"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4" fill="#ffffff"></circle><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    checkBig: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    checkWhite: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    film: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>',
    image: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
    video: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>',
    audio: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
    stream: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>',
    download: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
    downloadWhite: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
    copy: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
    filter: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>',
    wrench: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>',
    link: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
    trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
    plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    package: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
    globe: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
    cross: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    crossWhite: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    warningWhite: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    edit: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
    sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
    moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
    palette: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.045a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.01 17.461 2 12 2z"></path></svg>',
    settings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
    cookie: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="9" cy="9" r="1.5" fill="currentColor"></circle><circle cx="15" cy="8" r="1.5" fill="currentColor"></circle><circle cx="15" cy="15" r="1.5" fill="currentColor"></circle><circle cx="9" cy="16" r="1.5" fill="currentColor"></circle></svg>',
    book: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
    chart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
    refresh: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>',
    volume: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>',
    speech: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>',
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    plug: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 11V7a4 4 0 0 0-8 0v4"></path><rect x="8" y="11" width="8" height="10" rx="1"></rect></svg>',
    shield: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
    monitor: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
    arrowDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>',
    arrowRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="8 5 8 19 19 12 8 5"></polygon></svg>',
    stop: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>',
    hourglass: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"></path><path d="M5 2h14"></path><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path></svg>',
    calendar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    timer: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    star: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
    thumbsUp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>',
    coin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="6" x2="12" y2="12"></line><path d="M12 16h.01"></path></svg>',
    lightning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
    bulb: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z"></path></svg>',
    folder: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
    rocket: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>',
    keyboard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6" y2="8.01"></line><line x1="10" y1="8" x2="10" y2="8.01"></line><line x1="14" y1="8" x2="14" y2="8.01"></line><line x1="18" y1="8" x2="18" y2="8.01"></line><line x1="6" y1="12" x2="6" y2="12.01"></line><line x1="10" y1="12" x2="10" y2="12.01"></line><line x1="14" y1="12" x2="14" y2="12.01"></line><line x1="18" y1="12" x2="18" y2="12.01"></line><line x1="6" y1="16" x2="18" y2="16"></line></svg>',
    lock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
    unlock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>',
    detective: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 11c.57.57 1.33.89 2.12.89s1.58-.32 2.12-.89"></path><circle cx="12" cy="11" r="6"></circle><path d="M4 4l2 2"></path><path d="M20 4l-2 2"></path></svg>',
    megaphone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>',
    party: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a3 3 0 1 0-6 0 3 3 0 0 0 6 0z"></path><path d="M6 15l2.5-2.5"></path><path d="M16.5 11.5L22 16"></path><path d="M12 18v4"></path><path d="M2 22l4-10 5.5 5.5L22 2"></path></svg>',
    checkMark: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    diamond: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2L2 8l10 14L22 8l-4-6H6z"></path></svg>',
    square: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"></rect></svg>',
    circle: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9"></circle></svg>',
    searchBig: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    checkBox: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
    record: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"></circle></svg>',
    reload: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>',
    save: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>',
    monitorBig: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
    streamBig: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>'
};

// Build new ICONS block
const iconLines = Object.keys(svgs).map(k => `            ${k}: '${svgs[k]}'`).join(',\n');
const newIconsBlock = `        ICONS: {\n${iconLines}\n        },`;

// Replace existing ICONS block (from ICONS: { to next }, that precedes COLORS)
content = content.replace(/        ICONS:\s*\{[\s\S]*?\},\n        COLORS:/, newIconsBlock + '\n        COLORS:');

// =========================================================================
// Emoji -> icon name mapping
// =========================================================================
const emojiToIcon = {
    '🖼': 'image',
    '🎬': 'video',
    '🎵': 'audio',
    '📺': 'stream',
    '📥': 'download',
    '⬇': 'arrowDown',
    '📋': 'copy',
    '🔧': 'wrench',
    '🔗': 'link',
    '🗑': 'trash',
    '➕': 'plus',
    '📦': 'package',
    '🌐': 'globe',
    '🌍': 'globe',
    '✅': 'checkBig',
    '✓': 'checkMark',
    '❌': 'cross',
    '✕': 'cross',
    '✖': 'cross',
    '⚠': 'warning',
    '📝': 'edit',
    '✏': 'edit',
    '☀': 'sun',
    '🌙': 'moon',
    '🎨': 'palette',
    '⚙': 'settings',
    '🍪': 'cookie',
    '📖': 'book',
    '📊': 'chart',
    '🔄': 'refresh',
    '🔁': 'reload',
    '🔊': 'volume',
    '💬': 'speech',
    '🔍': 'search',
    '🔎': 'searchBig',
    '👁': 'eye',
    '🔌': 'plug',
    '🛡': 'shield',
    '🖥': 'monitor',
    '▶': 'arrowRight',
    '⏹': 'stop',
    '⏳': 'hourglass',
    '📅': 'calendar',
    '⏱': 'timer',
    '⭐': 'star',
    '👍': 'thumbsUp',
    '🪙': 'coin',
    '⚡': 'lightning',
    '📕': 'book',
    '💡': 'bulb',
    '📂': 'folder',
    '🚀': 'rocket',
    '🎞': 'film',
    '⌨': 'keyboard',
    '🔐': 'lock',
    '🔓': 'unlock',
    '🕵': 'detective',
    '📣': 'megaphone',
    '🎉': 'party',
    '☑': 'checkBox',
    '⏺': 'record',
    '🔷': 'diamond',
    '🟦': 'square',
    '🔵': 'circle',
    '🟩': 'square',
    '💾': 'save'
};

// Special handling: when emoji appears as the only content of textContent assignment, use innerHTML with SVG.
// For textContent assignments that prefix emoji+space+text, we switch to innerHTML with SVG+space+text.
// For toast (textContent), we remove emoji prefix.
// For placeholder/select, we remove emoji from LANG strings.

// Helper to build SVG reference
function ref(icon) {
    return `MS_CONFIG.ICONS.${icon}`;
}

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{203C}\u{2049}\u{2122}\u{2194}-\u{2199}\u{21A9}-\u{21AA}\u{231A}-\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{26FF}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{271D}\u{2721}\u{2728}\u{2733}-\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}-\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{27BF}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}]/gu;

// =========================================================================
// Replace emoji in comments (// lines) with inline SVG string
// =========================================================================
const lines = content.split('\n');
const commentEmojis = ['🎨', '🏭', '🧩', '🌍', '🛡', '💾', '🕵', '📣', '🎬', '🔌', '🔄', '📊', '🔎', '⬇', '🖼', '💬', '🚀'];
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('//')) {
        let changed = line;
        for (const e of commentEmojis) {
            if (changed.indexOf(e) !== -1) {
                const icon = emojiToIcon[e];
                if (icon) changed = changed.split(e).join(`<svg width="18" height="18" viewBox="0 0 24 24" style="vertical-align:middle;">${svgs[icon].replace(/width="[^"]*"/,'').replace(/height="[^"]*"/,'').replace(/style="[^"]*"/,'')}</svg>`);
            }
        }
        lines[i] = changed;
    }
}
content = lines.join('\n');


// Text-only keys (used in textContent/placeholder/toast)
const textOnlyKeys = new Set([
    'enabled', 'disabled', 'themeAuto', 'themeLight', 'themeDark',
    'searchPlaceholder', 'advFilter', 'plsInputText',
    'transDone', 'transFail', 'transFailShort',
    'copiedN', 'scanDoneToast', 'filterAppliedToast', 'scriptCopied', 'rescanDone',
    'm3u8Done', 'm3u8Fail', 'logLevelChanged', 'resetDone',
    'added', 'cleared', 'clearedRefresh', 'addToLs', 'coverExtracted',
    'copied', 'noFiles', 'noSelected', 'startDl', 'dlDone', 'done', 'stopped',
    'scanning', 'scanDone', 'filterApplied', 'noMedia', 'loading', 'ok', 'fail',
    'confirm', 'cancel', 'copyFail', 'addFail', 'delFail', 'clearFail', 'readCookieFail',
    'transNetErr', 'transTimeout', 'transNeedKey', 'transAllFail', 'transPartialFail',
    'transEngineSelect', 'transInputPh', 'transResultPh', 'transBtn', 'clearBtn',
    'plsCheck', 'noCookie', 'cookieName', 'cookieValue', 'confirmClearCookie',
    'keyName', 'keyValue', 'confirmClearStorage',
    'transHistory', 'transNoHistory', 'transClearHistory',
    'downloading', 'batchStart', 'dlStopped', 'translating', 'translatingShort', 'm3u8Start',
    'batchDone'
]);

// HTML keys (keep icon as SVG)
const svgKeys = new Set([
    'tabImg', 'tabVideo', 'tabAudio', 'tabM3u8', 'tabTranslate', 'tabCookie', 'tabStorage', 'tabSettings',
    'advFilterTitle', 'copyCookieStr', 'copyJson', 'addCookie', 'clearSite',
    'exportLs', 'exportSs', 'addItem', 'clearAll', 'lsTitle', 'ssTitle', 'lsCount',
    'transTitle', 'copyResult', 'resultAsInput', 'speakBtn',
    'm3u8Title', 'm3u8Detail', 'encrypted', 'notEncrypted',
    'logLevelTitle', 'otherOps', 'exportAllConfig', 'importConfig', 'batchTitle', 'requestHeaders',
    'shortcutTitle', 'downloadSelBtn', 'genScript', 'rescan', 'genScriptBtn', 'detailBtn', 'dlMerge'
]);

// Process LANG strings line by line
const langLines = content.split('\n');
for (let i = 0; i < langLines.length; i++) {
    const line = langLines[i];
    // Match dictionary entries like 'key': '...'
    const match = line.match(/^\s*'([^']+)':\s*'([^']*)'/);
    if (!match) continue;
    const key = match[1];
    const val = match[2];
    if (!emojiRegex.test(val)) continue;
    let newVal = val;
    if (textOnlyKeys.has(key)) {
        // remove leading emoji + optional space
        newVal = val.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{203C}\u{2049}\u{2194}-\u{2199}\u{21A9}-\u{21AA}\u{231A}-\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{271D}\u{2721}\u{2728}\u{2733}-\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}-\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{27BF}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{1FA00}-\u{1FAFF}]\s?/u, '');
    } else if (svgKeys.has(key)) {
        // replace leading emoji with SVG reference + ' '
        newVal = val.replace(/^([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{203C}\u{2049}\u{2194}-\u{2199}\u{21A9}-\u{21AA}\u{231A}-\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{271D}\u{2721}\u{2728}\u{2733}-\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}-\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{27BF}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{1FA00}-\u{1FAFF}])\s?/u, function(m, e) {
            const icon = emojiToIcon[e];
            if (!icon) return '';
            return `' + ${ref(icon)} + '`;
        });
        // If result starts with quote+space, it was just a text change; otherwise it becomes concatenation
        // We need to reconstruct the assignment
        if (newVal !== val) {
            // newVal now contains something like `' + MS_CONFIG.ICONS.image + '图片'` or `' + MS_CONFIG.ICONS.image + ' 图片'`
            // We need to wrap it properly
            langLines[i] = line.replace(`'${val}'`, newVal.replace(/^'/, '').replace(/'$/, ''));
            continue;
        }
    }
    if (newVal !== val) {
        langLines[i] = line.replace(`'${val}'`, `'${newVal}'`);
    }
}
content = langLines.join('\n');

// =========================================================================
// Code-level replacements
// =========================================================================

// icon: 'emoji' -> icon: MS_CONFIG.ICONS.xxx
for (const [e, icon] of Object.entries(emojiToIcon)) {
    content = content.replace(new RegExp(`icon:\\s*'${escapeRegExp(e)}'`, 'gu'), `icon: ${ref(icon)}`);
}

// siteIcon: 'emoji' -> siteIcon: MS_CONFIG.ICONS.xxx
for (const [e, icon] of Object.entries(emojiToIcon)) {
    content = content.replace(new RegExp(`siteIcon:\\s*'${escapeRegExp(e)}'`, 'gu'), `siteIcon: ${ref(icon)}`);
}

// data.siteIcon || 'emoji' -> data.siteIcon || MS_CONFIG.ICONS.xxx
for (const [e, icon] of Object.entries(emojiToIcon)) {
    content = content.replace(new RegExp(`\\|\\|\\s*'${escapeRegExp(e)}'`, 'gu'), `|| ${ref(icon)}`);
}

// HTML strings with emoji prefix like '>emoji text<' or '...">emoji text<'
// We'll handle common patterns manually below.

// Specific textContent assignments with emoji -> switch to innerHTML with SVG
const textContentReplacements = [
    { from: "d.textContent = '▶';", to: "d.innerHTML = MS_CONFIG.ICONS.arrowRight;" },
    { from: "firstChild.textContent === '🎬'", to: "firstChild.innerHTML === MS_CONFIG.ICONS.video" },
    { from: "d.textContent = '🎬';", to: "d.innerHTML = MS_CONFIG.ICONS.video;" },
    { from: "resolveBtn.textContent = '✅ 已解析';", to: "resolveBtn.innerHTML = MS_CONFIG.ICONS.checkBig + ' 已解析';" },
    { from: "closeBtn.textContent = '✕';", to: "closeBtn.innerHTML = MS_CONFIG.ICONS.cross;" },
    { from: "batchBtn.textContent = '⏳ 解析中...';", to: "batchBtn.innerHTML = MS_CONFIG.ICONS.hourglass + ' 解析中...';" },
    { from: "batchBtn.textContent = '🔄 一键解析全部';", to: "batchBtn.innerHTML = MS_CONFIG.ICONS.refresh + ' 一键解析全部';" },
    { from: "arrow.textContent = expanded ? '▼' : '▶';", to: "arrow.innerHTML = expanded ? '▼' : MS_CONFIG.ICONS.arrowRight;" },
    { from: "cpSave.textContent = '💾 ' + LANG.t('ok');", to: "cpSave.innerHTML = MS_CONFIG.ICONS.save + ' ' + LANG.t('ok');" },
    { from: "drBtn.textContent = '💾 ' + LANG.t('saveRules');", to: "drBtn.innerHTML = MS_CONFIG.ICONS.save + ' ' + LANG.t('saveRules');" },
    { from: "ruleFormTitle.textContent = '➕ ' + LANG.t('addRule');", to: "ruleFormTitle.innerHTML = MS_CONFIG.ICONS.plus + ' ' + LANG.t('addRule');" },
    { from: "ruleFormTitle.textContent = '✏️ ' + LANG.t('edit') + ' ' + (rule.name || rule.pattern);", to: "ruleFormTitle.innerHTML = MS_CONFIG.ICONS.edit + ' ' + LANG.t('edit') + ' ' + (rule.name || rule.pattern);" },
    { from: "ruleSaveBtn.textContent = '💾 ' + LANG.t('ok');", to: "ruleSaveBtn.innerHTML = MS_CONFIG.ICONS.save + ' ' + LANG.t('ok');" },
    { from: "parserFormTitle.textContent = '➕ ' + LANG.t('addParser');", to: "parserFormTitle.innerHTML = MS_CONFIG.ICONS.plus + ' ' + LANG.t('addParser');" },
    { from: "parserFormTitle.textContent = '✏️ ' + LANG.t('edit') + ' ' + (parser.name || parser.matchPattern);", to: "parserFormTitle.innerHTML = MS_CONFIG.ICONS.edit + ' ' + LANG.t('edit') + ' ' + (parser.name || parser.matchPattern);" },
    { from: "parserSaveBtn.textContent = '💾 ' + LANG.t('ok');", to: "parserSaveBtn.innerHTML = MS_CONFIG.ICONS.save + ' ' + LANG.t('ok');" },
    { from: "left.textContent = (item.success ? '✅ ' : '❌ ') + (item.name || item.url);", to: "left.innerHTML = (item.success ? MS_CONFIG.ICONS.checkBig + ' ' : MS_CONFIG.ICONS.cross + ' ') + (item.name || item.url);" }
];
for (const r of textContentReplacements) {
    content = content.split(r.from).join(r.to);
}

// Theme select array: remove emoji prefixes since options are text
content = content.replace(/var themes = \[\['auto', '🖥 ' \+ LANG\.t\('themeAuto'\)\], \['light', '☀ ' \+ LANG\.t\('themeLight'\)\], \['dark', '🌙 ' \+ LANG\.t\('themeDark'\)\]\];/g,
    "var themes = [['auto', LANG.t('themeAuto')], ['light', LANG.t('themeLight')], ['dark', LANG.t('themeDark')]];");

// mkBtn('emoji ' + LANG...) -> mkBtn innerHTML? mkBtn likely uses textContent; switch to string concat with SVG? Hard.
// We'll change mkBtn calls to build innerHTML if mkBtn supports html. Let's inspect mkBtn first; assume textContent.
// For now, remove emoji prefix and keep text.
const mkBtnPatterns = [
    ["mkBtn('⬇ ' + LANG.t('download')", "mkBtn(LANG.t('download')"],
    ["mkBtn('📋 ' + LANG.t('copyUrl')", "mkBtn(LANG.t('copyUrl')"],
    ["mkBtn('🌐 ' + LANG.t('openTab')", "mkBtn(LANG.t('openTab')"],
    ["mkBtn('⏺ 录制媒体流'", "mkBtn('录制媒体流'"],
    ["mkBtn('🎞 ' + LANG.t('extractCover')", "mkBtn(LANG.t('extractCover')"],
    ["btn('✕ ' + LANG.t('close')", "btn(LANG.t('close')"],
    ["btn('☑ ' + LANG.t('selectBtn')", "btn(LANG.t('selectBtn')"]
];
for (const [from, to] of mkBtnPatterns) {
    content = content.split(from).join(to);
}

// Toast with hardcoded emoji prefix -> remove emoji
content = content.replace(/toast\('🔊 ' \+ LANG\.t\('saved'\)\);/g, "toast(LANG.t('saved'));");
content = content.replace(/toast\('✅ ' \+ res\.msg\);/g, "toast(res.msg);");
content = content.replace(/toast\('❌ ' \+ res\.msg, '#ef4444'\);/g, "toast(res.msg, '#ef4444');");
content = content.replace(/toast\(err \? '❌ 翻译失败' : LANG\.t\('transDone'\)\);/g, "toast(err ? LANG.t('transFail') : LANG.t('transDone'));");

// LOG.info with emoji -> remove
content = content.replace(/LOG\.info\('浮动按钮创建成功 ✓'\);/g, "LOG.info('浮动按钮创建成功');");

// Return emoji+text helper (used in innerHTML contexts? let's keep SVG)
content = content.replace(/if \(kind === 'image'\) return '🖼 ' \+ LANG\.t\('img'\);/g, "if (kind === 'image') return MS_CONFIG.ICONS.image + ' ' + LANG.t('img');");
content = content.replace(/if \(kind === 'audio'\) return '🎵 ' \+ LANG\.t\('audio'\);/g, "if (kind === 'audio') return MS_CONFIG.ICONS.audio + ' ' + LANG.t('audio');");
content = content.replace(/if \(kind === 'm3u8'\) return '📺 ' \+ LANG\.t\('m3u8'\);/g, "if (kind === 'm3u8') return MS_CONFIG.ICONS.stream + ' ' + LANG.t('m3u8');");
content = content.replace(/if \(kind === 'stream'\) return '🔗 ' \+ LANG\.t\('video'\);/g, "if (kind === 'stream') return MS_CONFIG.ICONS.link + ' ' + LANG.t('video');");
content = content.replace(/return '🎬 ' \+ LANG\.t\('video'\);/g, "return MS_CONFIG.ICONS.video + ' ' + LANG.t('video');");

// resolveBtnText uses textContent later -> remove emoji
content = content.replace(/var resolveBtnText = isResolved \? '✅ 已解析' : '解析 ⬇';/g, "var resolveBtnText = isResolved ? '已解析' : '解析';");

// Python script string with ✅ ❌ -> keep text markers
content = content.replace(/print\("✅", name\)/g, 'print("[OK]", name)');
content = content.replace(/print\("❌", name, e\)/g, 'print("[ERR]", name, e)');

// Context menu items icon: emoji -> SVG reference (innerHTML context)
content = content.replace(/{ icon: '📂', label: LANG\.t\('ctxOpenPanel'\)/g, "{ icon: MS_CONFIG.ICONS.folder, label: LANG.t('ctxOpenPanel')");
content = content.replace(/{ icon: '📥', label: LANG\.t\('ctxQuickDownload'\)/g, "{ icon: MS_CONFIG.ICONS.download, label: LANG.t('ctxQuickDownload')");
content = content.replace(/{ icon: '🌐', label: LANG\.t\('ctxTranslate'\)/g, "{ icon: MS_CONFIG.ICONS.globe, label: LANG.t('ctxTranslate')");
content = content.replace(/{ icon: '⚙️', label: LANG\.t\('ctxSettings'\)/g, "{ icon: MS_CONFIG.ICONS.settings, label: LANG.t('ctxSettings')");
content = content.replace(/{ icon: '✖️', label: LANG\.t\('ctxClose'\)/g, "{ icon: MS_CONFIG.ICONS.cross, label: LANG.t('ctxClose')");

// Video link preview context menu
content = content.replace(/{ icon: '▶️', label: '预览视频'/g, "{ icon: MS_CONFIG.ICONS.arrowRight, label: '预览视频'");
content = content.replace(/{ icon: '📋', label: '复制链接'/g, "{ icon: MS_CONFIG.ICONS.copy, label: '复制链接'");
content = content.replace(/{ icon: '📥', label: '下载视频'/g, "{ icon: MS_CONFIG.ICONS.download, label: '下载视频'");
content = content.replace(/{ icon: '🔗', label: '打开原网页'/g, "{ icon: MS_CONFIG.ICONS.link, label: '打开原网页'");

// HTML inline emoji replacements (common patterns)
content = content.replace(/>🎉</g, `>${svgs.party}<`);
content = content.replace(/>⚠️</g, `>${svgs.warning}<`);
content = content.replace(/>🔄 重试</g, `>${svgs.refresh} 重试<`);
content = content.replace(/<span>🔊<\/span>自动播放/g, `<span>${svgs.volume}</span>自动播放`);
content = content.replace(/<span style="font-size:22px;">▶️<\/span><span>播放<\/span>/g, `<span style="font-size:22px;">${svgs.arrowRight}</span><span>播放</span>`);
content = content.replace(/<span style="font-size:22px;">📥<\/span><span>下载<\/span>/g, `<span style="font-size:22px;">${svgs.download}</span><span>下载</span>`);
content = content.replace(/<span style="font-size:22px;">📋<\/span><span>复制<\/span>/g, `<span style="font-size:22px;">${svgs.copy}</span><span>复制</span>`);

// Buttons with emoji text
content = content.replace(/>📥 下载视频</g, `>${svgs.downloadWhite} 下载视频<`);
content = content.replace(/>📋 复制链接</g, `>${svgs.copy} 复制链接<`);
content = content.replace(/>▶️ 播放</g, `>${svgs.playSmall} 播放<`);

// Stats with emoji
content = content.replace(/title="播放量">▶️ /g, `title="播放量">${svgs.arrowRight} `);
content = content.replace(/title="点赞">👍 /g, `title="点赞">${svgs.thumbsUp} `);
content = content.replace(/title="投币">🪙 /g, `title="投币">${svgs.coin} `);
content = content.replace(/title="收藏">⭐ /g, `title="收藏">${svgs.star} `);
content = content.replace(/title="评论">💬 /g, `title="评论">${svgs.speech} `);
content = content.replace(/>📅 /g, `>${svgs.calendar} `);
content = content.replace(/>📺 BV号:/g, `>${svgs.stream} BV号:`);
content = content.replace(/>⏱ 时长:/g, `>${svgs.timer} 时长:`);

// HTML labels with emoji prefixes in info blocks
content = content.replace(/>🎞 ' \+ LANG\.t\('autoThumb'\)/g, `>${svgs.film} ' + LANG.t('autoThumb')`);
content = content.replace(/>🔄 ' \+ LANG\.t\('autoCheckUpdate'\)/g, `>${svgs.refresh} ' + LANG.t('autoCheckUpdate')`);
content = content.replace(/>💾 ' \+ LANG\.t\('persistSelection'\)/g, `>${svgs.save} ' + LANG.t('persistSelection')`);

// Main toolbar buttons
content = content.replace(/>📥 ' \+ LANG\.t\('downloadSel'\)/g, `>${svgs.downloadWhite} ' + LANG.t('downloadSel')`);
content = content.replace(/>📥 ' \+ LANG\.t\('downloadAll'\)/g, `>${svgs.downloadWhite} ' + LANG.t('downloadAll')`);
content = content.replace(/>📋 ' \+ LANG\.t\('copySelUrl'\)/g, `>${svgs.copy} ' + LANG.t('copySelUrl')`);
content = content.replace(/>📋 ' \+ LANG\.t\('copyAllUrl'\)/g, `>${svgs.copy} ' + LANG.t('copyAllUrl')`);
content = content.replace(/>🔧 ' \+ LANG\.t\('filter'\)/g, `>${svgs.wrench} ' + LANG.t('filter')`);

// Other HTML emoji prefixes
content = content.replace(/<span>🔗 视频页面链接/g, `<span>${svgs.link} 视频页面链接`);
content = content.replace(/>🔄 ' \+ LANG\.t\('batchResolve'\)/g, `>${svgs.refresh} ' + LANG.t('batchResolve')`);
content = content.replace(/<div style="font-size:32px;margin-bottom:8px;">⚠️<\/div>/g, `<div style="font-size:32px;margin-bottom:8px;">${svgs.warningWhite}</div>`);

// Video cover fallback icon
content = content.replace(/d\.textContent='\$\{MS_CONFIG\.ICONS\.play\}'/g, "d.innerHTML=MS_CONFIG.ICONS.play"); // actually was textContent in onerror

// The placeholder check uses emoji text; update regex and assignment
content = content.replace(/var icon = kind === 'img' \? '🖼' : kind === 'video' \? '🎬' : kind === 'audio' \? '🎵' : '📺';/g,
    "var icon = kind === 'img' ? MS_CONFIG.ICONS.image : kind === 'video' ? MS_CONFIG.ICONS.video : kind === 'audio' ? MS_CONFIG.ICONS.audio : MS_CONFIG.ICONS.stream;");
content = content.replace(/\.replace\(\/\^\[🖼🎬🎵📺\]\/, ''\)/g, ".replace(/^[\\u{1F300}-\\u{1F9FF}]/u, '')");

// Remove emoji from import success message (text in JSON)
content = content.replace(/return \{ ok: true, msg: '✅ 配置已导入并校验通过' \};/g, "return { ok: true, msg: '配置已导入并校验通过' };");

// Write result
fs.writeFileSync(path, content);
console.log('Replacement done. Checking remaining emoji...');

// Check remaining emoji
const remaining = [];
const outLines = content.split('\n');
outLines.forEach((line, idx) => {
    const m = line.match(emojiRegex);
    if (m) remaining.push({ line: idx + 1, emojis: m, text: line.slice(0, 120) });
});
console.log('Remaining emoji occurrences:', remaining.length);
remaining.forEach(r => console.log(`L${r.line}: [${r.emojis.join(',')}] ${r.text}`));

function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
