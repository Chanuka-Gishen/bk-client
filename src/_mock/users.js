export const USERS = [
  {
    _id: '001',
    userFullName: 'John',
    userEmail: 'john.doe@example.com',
    userPhoneNumber: '555-1234',
    userAddress: '123 Main St, Cityville',
  },
];

export const UNITS = [
  {
    _id: '001',
    unitBrand: 'Singer',
    unitModel: 'W2120912LK',
    unitInstallationDate: '2022-01-01',
    unitLastMaintenanceDate: '2022-01-01',
    unitNextMaintenanceDate: '2022-03-03',
    status: 'Active',
  },
  {
    _id: '002',
    unitBrand: 'Singer',
    unitModel: 'W2120913LK',
    unitInstallationDate: '2022-01-01',
    unitLastMaintenanceDate: '2022-01-01',
    unitNextMaintenanceDate: '2022-03-03',
    status: 'Active',
  },
];

export const JOBS = [
  {
    _id: '001',
    jobId: '230301-001',
    jobUserId: '001', // Reference to the user
    jobScheduledDate: '2023-03-01',
    isServiced: false,
    jobImages: [
      {
        imageId: 'image1',
        imageUrl: 'https://example.com/image1.jpg',
        description: 'Before maintenance',
      },
    ],
    acUnitReferences: [
      {
        unitId: '001',
        isServiced: false,
      },
      {
        unitId: '002',
        isServiced: false,
      },
    ],
  },
];
