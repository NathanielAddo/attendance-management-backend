// device.ts

interface DeviceInfo {
    deviceId: string;
    deviceName: string;
  }
  
  interface DeviceRequest {
    id: number;
    userId: string;
    deviceInfo: DeviceInfo;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
    approvedAt?: string | null;
    rejectedAt?: string | null;
    reviewedBy?: string | null;
  }
  
  // Optional: You can create a class as well for handling operations on the entity if needed.
  class DeviceRequestEntity implements DeviceRequest {
    id: number;
    userId: string;
    deviceInfo: DeviceInfo;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
    approvedAt?: string | null;
    rejectedAt?: string | null;
    reviewedBy?: string | null;
  
    constructor(
      id: number,
      userId: string,
      deviceInfo: DeviceInfo,
      status: 'pending' | 'approved' | 'rejected',
      createdAt: string,
      updatedAt: string,
      approvedAt?: string | null,
      rejectedAt?: string | null,
      reviewedBy?: string | null
    ) {
      this.id = id;
      this.userId = userId;
      this.deviceInfo = deviceInfo;
      this.status = status;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.approvedAt = approvedAt;
      this.rejectedAt = rejectedAt;
      this.reviewedBy = reviewedBy;
    }
  
    // Example method: Convert this object to a response-friendly format
    toResponse() {
      return {
        requestId: this.id,
        deviceId: this.deviceInfo.deviceId,
        deviceName: this.deviceInfo.deviceName,
        status: this.status,
        submittedAt: this.createdAt,
        approvedAt: this.approvedAt,
        rejectedAt: this.rejectedAt,
        reviewedBy: this.reviewedBy
      };
    }
  }
  
  export { DeviceInfo, DeviceRequest, DeviceRequestEntity };
  