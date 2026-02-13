// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/mongodb';
// import { verifyToken } from '@/lib/jwt';
// import UserCompany from '@/models/UserCompany';

// export async function POST(request: NextRequest) {
//   try {
//     console.log('🔄 POST /api/debug/fix-ownership - Fixing company ownership...');
    
//     const authToken = request.cookies.get('auth_token')?.value;
    
//     if (!authToken) {
//       return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = verifyToken(authToken);
//     await connectToDatabase();

//     const { companyId } = await request.json();

//     if (!companyId) {
//       return NextResponse.json({ 
//         success: false, 
//         error: 'Company ID is required' 
//       }, { status: 400 });
//     }

//     console.log(`🔧 Fixing ownership for user ${decoded.userId} on company ${companyId}`);

//     // Check if membership exists
//     let membership = await UserCompany.findOne({
//       userId: decoded.userId,
//       companyId
//     });

//     if (membership) {
//       // Update to active admin
//       membership.status = 'active';
//       membership.role = 'admin';
//       await membership.save();
      
//       console.log('✅ Updated existing membership to active admin');
      
//       return NextResponse.json({
//         success: true,
//         message: 'Your membership has been activated!',
//         membership
//       });
//     } else {
//       // Create new membership
//       membership = new UserCompany({
//         userId: decoded.userId,
//         companyId,
//         role: 'admin',
//         status: 'active',
//         joinedAt: new Date(),
//         isDefault: true,
//         invitedBy: decoded.userId,
//         invitedByName: decoded.name || 'System',
//         department: '',
//         jobTitle: ''
//       });
      
//       await membership.save();
      
//       console.log('✅ Created new admin membership');
      
//       return NextResponse.json({
//         success: true,
//         message: 'You have been added as an admin!',
//         membership
//       });
//     }

//   } catch (error: any) {
//     console.error('❌ Fix ownership error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // Also add GET method for easy testing
// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const companyId = searchParams.get('companyId');
    
//     if (!companyId) {
//       return NextResponse.json({ 
//         success: false, 
//         error: 'Company ID is required as query parameter' 
//       }, { status: 400 });
//     }

//     // Forward to POST with the companyId
//     const modifiedRequest = {
//       ...request,
//       json: async () => ({ companyId })
//     } as NextRequest;

//     return POST(modifiedRequest, { params: {} } as any);
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }