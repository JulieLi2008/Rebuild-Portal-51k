import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { createTeamMember } from '../services/teamMemberService';
import { TeamMember } from '../types';

const teamMembers: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    displayName: 'Julie Li',
    email: 'info@51wood.ca',
    phone: '',
    role: 'Owner',
    permissionsRole: 'SuperAdmin',
    workerType: 'Manager',
    employmentType: 'Salary',
    storeId: 'S1',
    status: 'Active',
    canLogin: true,
    linkedUserId: '',
    hourlyRate: 0,
    pieceRate: 0,
    caseRate: 0,
    contractRate: 0,
    commissionRate: 0,
    notes: 'Owner / SuperAdmin demo profile.',
    createdBy: 'seed-script',
  },
  {
    displayName: 'Demo Manager',
    email: 'manager@51wood.ca',
    phone: '',
    role: 'Manager',
    permissionsRole: 'Manager',
    workerType: 'Manager',
    employmentType: 'Salary',
    storeId: 'S1',
    status: 'Active',
    canLogin: true,
    linkedUserId: '',
    hourlyRate: 0,
    pieceRate: 0,
    caseRate: 0,
    contractRate: 0,
    commissionRate: 0,
    notes: 'Demo manager account.',
    createdBy: 'seed-script',
  },
  {
    displayName: 'Demo Sales',
    email: 'sales@51wood.ca',
    phone: '',
    role: 'Sales',
    permissionsRole: 'Sales',
    workerType: 'Sales',
    employmentType: 'Commission',
    storeId: 'S1',
    status: 'Active',
    canLogin: true,
    linkedUserId: '',
    hourlyRate: 0,
    pieceRate: 0,
    caseRate: 0,
    contractRate: 0,
    commissionRate: 5,
    notes: 'Demo sales account.',
    createdBy: 'seed-script',
  },
  {
    displayName: 'Demo Designer',
    email: 'designer@51wood.ca',
    phone: '',
    role: 'Designer',
    permissionsRole: 'Designer',
    workerType: 'Designer',
    employmentType: 'Work by case',
    storeId: 'S1',
    status: 'Active',
    canLogin: true,
    linkedUserId: '',
    hourlyRate: 0,
    pieceRate: 0,
    caseRate: 150,
    contractRate: 0,
    commissionRate: 0,
    notes: 'Demo designer paid by case.',
    createdBy: 'seed-script',
  },
  {
    displayName: 'Demo Cabinet Maker',
    email: 'cabinetmaker@51wood.ca',
    phone: '',
    role: 'CabinetMaker',
    permissionsRole: 'Cabinet Maker',
    workerType: 'Cabinet Maker',
    employmentType: 'Work by hour',
    storeId: 'S1',
    status: 'Active',
    canLogin: true,
    linkedUserId: '',
    hourlyRate: 28,
    pieceRate: 0,
    caseRate: 0,
    contractRate: 0,
    commissionRate: 0,
    notes: 'Demo cabinet maker paid hourly.',
    createdBy: 'seed-script',
  },
  {
    displayName: 'Demo Installer',
    email: 'installer@51wood.ca',
    phone: '',
    role: 'Installer',
    permissionsRole: 'Installer',
    workerType: 'Installer',
    employmentType: 'Work by case',
    storeId: 'S1',
    status: 'Active',
    canLogin: true,
    linkedUserId: '',
    hourlyRate: 0,
    pieceRate: 0,
    caseRate: 250,
    contractRate: 0,
    commissionRate: 0,
    notes: 'Demo installer paid by case.',
    createdBy: 'seed-script',
  },
  {
    displayName: 'Demo Installer Helper',
    email: 'installerhelper@51wood.ca',
    phone: '',
    role: 'InstallerHelper',
    permissionsRole: 'Installer Helper',
    workerType: 'Installer Helper',
    employmentType: 'Work by hour',
    storeId: 'S1',
    status: 'Active',
    canLogin: true,
    linkedUserId: '',
    hourlyRate: 22,
    pieceRate: 0,
    caseRate: 0,
    contractRate: 0,
    commissionRate: 0,
    notes: 'Demo installer helper.',
    createdBy: 'seed-script',
  },
  {
    displayName: 'Demo Countertop Subcontractor',
    email: 'countertop@51wood.ca',
    phone: '',
    role: 'CountertopSubcontractor',
    permissionsRole: 'Countertop Subcontractor',
    workerType: 'Countertop Subcontractor',
    employmentType: 'Subcontract',
    storeId: 'S1',
    status: 'Active',
    canLogin: true,
    linkedUserId: '',
    hourlyRate: 0,
    pieceRate: 0,
    caseRate: 0,
    contractRate: 0,
    commissionRate: 0,
    notes: 'Demo countertop subcontractor. Should not see customer phone or payment.',
    createdBy: 'seed-script',
  },
];

const seedTeamMembers = async () => {
  try {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required to write team members.');
    }

    await signInWithEmailAndPassword(auth, email, password);
    console.log(`Signed in as ${email}`);

    for (const member of teamMembers) {
      const memberId = await createTeamMember(member);
      console.log(`Seeded team member: ${member.displayName} (${memberId})`);
    }

    console.log('Team members seeded successfully.');
    await signOut(auth);
  } catch (error) {
    console.error('Failed to seed team members:', error);
    process.exit(1);
  }
};

seedTeamMembers();
