import { db, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "./firebase";

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const TEMPLATE_ID   = Number(import.meta.env.VITE_BREVO_TEMPLATE_ID);
const TO_EMAIL      = import.meta.env.VITE_BREVO_TO_EMAIL;
const TO_NAME       = import.meta.env.VITE_BREVO_TO_NAME || "1to1 Home Tutors";

async function sendEmail(params) {
  if (!BREVO_API_KEY || !TEMPLATE_ID || !TO_EMAIL) {
    console.warn("⚠️ Email config missing — check .env file");
    return;
  }
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept":       "application/json",
        "api-key":      BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        templateId: TEMPLATE_ID,
        to: [{ email: TO_EMAIL, name: TO_NAME }],
        params,
      }),
    });
    const data = await res.json();
    if (!res.ok) console.error("Brevo error:", data);
    else console.log("✅ Email sent via Brevo");
  } catch (err) {
    console.error("Email failed:", err);
  }
}

export async function submitEnquiry(formData) {
  try {
    await addDoc(collection(db, "enquiries"), {
      student_name:   formData.name     || "",
      parent_name:    formData.parent   || "",
      phone:          formData.phone    || "",
      email:          formData.email    || "",
      class_selected: formData.class_   || "",
      board:          formData.board    || "",
      subjects:       formData.subjects || "",
      area:           formData.area     || "",
      course_type:    formData.type     || "",
      message:        formData.msg      || "",
      enquiry_source: "inquiry_form",
      status:         "new",
      created_at:     serverTimestamp(),
    });
    console.log("✅ Enquiry saved to Firebase");

    await sendEmail({
      student_name:   formData.name     || "Not provided",
      parent_name:    formData.parent   || "Not provided",
      phone:          formData.phone    || "Not provided",
      email:          formData.email    || "Not provided",
      class_selected: formData.class_   || "Not specified",
      board:          formData.board    || "Not specified",
      subjects:       formData.subjects || "Not specified",
      area:           formData.area     || "Not specified",
      course_type:    formData.type     || "Not specified",
      message:        formData.msg      || "No message",
      enquiry_source: "Main Inquiry Form",
      submitted_time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Enquiry error:", error);
    return { success: false, error };
  }
}

export async function submitBoardEnquiry(boardData) {
  try {
    const topicsDetail = (boardData.selectedSubjects || [])
      .map(s => s.name + ": " + (s.topics && s.topics.length > 0 ? s.topics.join(", ") : "Full Subject"))
      .join(" | ");

    await addDoc(collection(db, "board_widget_enquiries"), {
      name:              boardData.name       || "",
      phone:             boardData.phone      || "",
      area:              boardData.area       || "",
      board_key:         boardData.boardKey   || "",
      board_label:       boardData.boardLabel || "",
      class_selected:    boardData.selClass   || null,
      selected_subjects: (boardData.selectedSubjects || []).map(s => s.name),
      topics_detail:     topicsDetail,
      enquiry_source:    "board_widget",
      status:            "new",
      created_at:        serverTimestamp(),
    });
    console.log("✅ Board enquiry saved to Firebase");

    await sendEmail({
      student_name:   boardData.name       || "Not provided",
      parent_name:    "Not provided",
      phone:          boardData.phone      || "Not provided",
      email:          "Not provided",
      class_selected: boardData.selClass ? "Class " + boardData.selClass : boardData.boardLabel || "",
      board:          boardData.boardLabel || "Not specified",
      subjects:       (boardData.selectedSubjects || []).map(s => s.name).join(", "),
      area:           boardData.area       || "Not specified",
      course_type:    "Board Widget Enquiry",
      message:        topicsDetail || "No specific topics selected",
      enquiry_source: "Board Selection Widget",
      submitted_time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Board enquiry error:", error);
    return { success: false, error };
  }
}

export async function submitTutorApplication(formData) {
  try {
    await addDoc(collection(db, "tutor_applications"), {
      name:             formData.name     || "",
      phone:            formData.phone    || "",
      email:            formData.email    || "",
      qualification:    formData.qual     || "",
      subjects:         formData.subjects || "",
      classes:          formData.classes  || "",
      area:             formData.area     || "",
      experience_years: formData.exp      || "",
      availability:     formData.avail    || "",
      about:            formData.about    || "",
      status:           "pending",
      created_at:       serverTimestamp(),
    });
    console.log("✅ Tutor application saved to Firebase");
    return { success: true };
  } catch (error) {
    console.error("❌ Tutor application error:", error);
    return { success: false, error };
  }
}

export async function fetchEnquiries() {
  try {
    const q = query(collection(db, "enquiries"), orderBy("created_at", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toLocaleString("en-IN") || "Just now"
    }));
  } catch (e) {
    console.error("Fetch enquiries error:", e);
    return [];
  }
}

export async function fetchApplications() {
  try {
    const q = query(collection(db, "tutor_applications"), orderBy("created_at", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toLocaleString("en-IN") || "Just now"
    }));
  } catch (e) {
    console.error("Fetch applications error:", e);
    return [];
  }
}

export async function fetchBoardEnquiries() {
  try {
    const q = query(collection(db, "board_widget_enquiries"), orderBy("created_at", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toLocaleString("en-IN") || "Just now"
    }));
  } catch (e) {
    console.error("Fetch board enquiries error:", e);
    return [];
  }
}