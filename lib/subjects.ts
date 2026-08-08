import { Subject } from "./types";

export const subjects: Subject[] = [
  // Semester 1
  { id: "applied-mathematics-1", semesterId: 1, code: "ECE-101", name: "Applied Mathematics I" },
  { id: "applied-physics", semesterId: 1, code: "ECE-102", name: "Applied Physics" },
  { id: "applied-chemistry", semesterId: 1, code: "ECE-103", name: "Applied Chemistry" },
  { id: "basic-electrical-engineering", semesterId: 1, code: "ECE-104", name: "Basic Electrical Engineering" },
  { id: "engineering-graphics", semesterId: 1, code: "ECE-105", name: "Engineering Graphics" },
  { id: "environmental-studies", semesterId: 1, code: "ECE-106", name: "Environmental Studies" },

  // Semester 2
  { id: "applied-mathematics-2", semesterId: 2, code: "ECE-151", name: "Applied Mathematics II" },
  { id: "programming-fundamentals", semesterId: 2, code: "ECE-152", name: "Programming Fundamentals" },
  { id: "basic-electronics-engineering", semesterId: 2, code: "ECE-153", name: "Basic Electronics Engineering" },
  { id: "engineering-mechanics", semesterId: 2, code: "ECE-154", name: "Engineering Mechanics" },
  { id: "english-for-communication", semesterId: 2, code: "ECE-155", name: "English for Communication" },
  { id: "workshop-practice", semesterId: 2, code: "ECE-156", name: "Workshop Practice" },

  // Semester 3
  { id: "network-analysis", semesterId: 3, code: "ECE-201", name: "Network Analysis" },
  { id: "analog-electronics", semesterId: 3, code: "ECE-203", name: "Analog Electronics" },
  { id: "signals-and-systems", semesterId: 3, code: "ECE-205", name: "Signals & Systems" },
  { id: "digital-electronics", semesterId: 3, code: "ECE-207", name: "Digital Electronics" },
  { id: "engineering-mathematics-3", semesterId: 3, code: "ECE-209", name: "Engineering Mathematics III" },
  { id: "electronic-devices", semesterId: 3, code: "ECE-211", name: "Electronic Devices" },

  // Semester 4
  { id: "mpmc", semesterId: 4, code: "ECE-251", name: "MPMC" },
  { id: "emft", semesterId: 4, code: "ECE-253", name: "EMFT" },
  { id: "analog-communication", semesterId: 4, code: "ECE-255", name: "Analog Communication" },
  { id: "control-systems", semesterId: 4, code: "ECE-257", name: "Control Systems" },
  { id: "probability-and-random-process", semesterId: 4, code: "ECE-259", name: "Probability & Random Process" },
  { id: "analog-electronics-2", semesterId: 4, code: "ECE-261", name: "Analog Electronics II" },

  // Semester 5
  { id: "digital-communication", semesterId: 5, code: "ECE-301", name: "Digital Communication" },
  { id: "digital-signal-processing", semesterId: 5, code: "ECE-303", name: "Digital Signal Processing" },
  { id: "antenna-and-wave-propagation", semesterId: 5, code: "ECE-305", name: "Antenna & Wave Propagation" },
  { id: "microwave-engineering", semesterId: 5, code: "ECE-307", name: "Microwave Engineering" },
  { id: "computer-networks", semesterId: 5, code: "ECE-309", name: "Computer Networks" },

  // Semester 6
  { id: "vlsi-design", semesterId: 6, code: "ECE-351", name: "VLSI Design" },
  { id: "optical-fiber-communication", semesterId: 6, code: "ECE-353", name: "Optical Fiber Communication" },
  { id: "wireless-and-mobile-communication", semesterId: 6, code: "ECE-355", name: "Wireless & Mobile Communication" },
  { id: "embedded-systems", semesterId: 6, code: "ECE-357", name: "Embedded Systems" },
  { id: "satellite-communication", semesterId: 6, code: "ECE-359", name: "Satellite Communication" },

  // Semester 7
  { id: "digital-image-processing", semesterId: 7, code: "ECE-401", name: "Digital Image Processing" },
  { id: "radar-systems", semesterId: 7, code: "ECE-403", name: "Radar Systems" },
  { id: "internet-of-things", semesterId: 7, code: "ECE-405", name: "Internet of Things" },
  { id: "professional-elective-1", semesterId: 7, code: "ECE-407", name: "Professional Elective I" },
  { id: "minor-project", semesterId: 7, code: "ECE-409", name: "Minor Project" },

  // Semester 8
  { id: "major-project", semesterId: 8, code: "ECE-451", name: "Major Project" },
  { id: "professional-elective-2", semesterId: 8, code: "ECE-453", name: "Professional Elective II" },
  { id: "industrial-training", semesterId: 8, code: "ECE-455", name: "Industrial Training" },
  { id: "professional-ethics", semesterId: 8, code: "ECE-457", name: "Professional Ethics" },
];

export function getSubjectsBySemester(semesterId: number): Subject[] {
  return subjects.filter((subject) => subject.semesterId === semesterId);
}