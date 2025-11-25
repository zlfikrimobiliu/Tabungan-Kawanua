import { NextRequest, NextResponse } from "next/server";

// Menggunakan JSONBin.io untuk storage persisten (GRATIS, tidak perlu setup database)
// JSONBin.io adalah service gratis untuk menyimpan JSON data
// Setup: https://jsonbin.io - buat akun gratis, copy API key

const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID || "default-bin-id";
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY || "";

// Default data structure
const defaultData = {
  members: [],
  transactions: [],
  gallery: [],
  currentWeek: 1,
  savingsSchedule: { dayOfWeek: 1, time: "09:00" },
  adminEmail: "fikri.mobiliu@example.com",
  lastUpdated: new Date().toISOString(),
};

// GET - Fetch data dari JSONBin.io
export async function GET(request: NextRequest) {
  try {
    // Jika tidak ada API key, return default (untuk development)
    if (!JSONBIN_API_KEY || JSONBIN_API_KEY === "") {
      return NextResponse.json({
        success: true,
        data: defaultData,
        warning: "JSONBin.io not configured. Using default data. Set JSONBIN_API_KEY in Vercel environment variables.",
      });
    }

    // Fetch dari JSONBin.io
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
      headers: {
        "X-Master-Key": JSONBIN_API_KEY,
        "X-Bin-Meta": "false",
      },
    });

    if (!response.ok) {
      // Jika bin belum ada, return default
      if (response.status === 404) {
        return NextResponse.json({
          success: true,
          data: defaultData,
        });
      }
      throw new Error(`JSONBin.io error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data || defaultData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    // Fallback ke default data jika error
    return NextResponse.json({
      success: true,
      data: defaultData,
      error: "Failed to fetch from JSONBin.io, using default data",
    });
  }
}

// POST - Update data ke JSONBin.io
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { members, transactions, gallery, currentWeek, savingsSchedule, adminEmail } = body;

    // Prepare data untuk disimpan
    const dataToSave = {
      members: members !== undefined ? members : defaultData.members,
      transactions: transactions !== undefined ? transactions : defaultData.transactions,
      gallery: gallery !== undefined ? gallery : defaultData.gallery,
      currentWeek: currentWeek !== undefined ? currentWeek : defaultData.currentWeek,
      savingsSchedule: savingsSchedule !== undefined ? savingsSchedule : defaultData.savingsSchedule,
      adminEmail: adminEmail !== undefined ? adminEmail : defaultData.adminEmail,
      lastUpdated: new Date().toISOString(),
    };

    // Jika tidak ada API key, return success tapi tidak save (untuk development)
    if (!JSONBIN_API_KEY || JSONBIN_API_KEY === "") {
      return NextResponse.json({
        success: true,
        data: dataToSave,
        warning: "JSONBin.io not configured. Data not saved. Set JSONBIN_API_KEY in Vercel environment variables.",
      });
    }

    // Update ke JSONBin.io
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_API_KEY,
      },
      body: JSON.stringify(dataToSave),
    });

    if (!response.ok) {
      // Jika bin belum ada, create baru
      if (response.status === 404) {
        const createResponse = await fetch("https://api.jsonbin.io/v3/b", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": JSONBIN_API_KEY,
            "X-Bin-Name": "Tabungan Kawanua Data",
          },
          body: JSON.stringify(dataToSave),
        });

        if (createResponse.ok) {
          const created = await createResponse.json();
          return NextResponse.json({
            success: true,
            data: dataToSave,
            message: "Data saved successfully (new bin created)",
            binId: created.metadata?.id,
          });
        } else {
          const errorText = await createResponse.text();
          throw new Error(`Failed to create bin: ${createResponse.status} - ${errorText}`);
        }
      }

      // Coba ambil error message dari response
      let errorMessage = `JSONBin.io error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Jika tidak bisa parse JSON, gunakan status text
        errorMessage = `JSONBin.io error: ${response.status} ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      data: dataToSave,
      message: "Data updated successfully",
    });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { 
        error: "Failed to update data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
