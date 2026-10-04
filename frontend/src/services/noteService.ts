export async function getNotes() {
  try {
    const response = await fetch("http://localhost:3000/api/v1/notes", {
      method: "GET",
    });
    if (response.ok) {
      const data = await response.json();
      return data.data.notes;
    } else throw new Error("Failed To Fetch");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function postNote(title: string, content: string) {
  try {
    const response = await fetch("http://localhost:3000/api/v1/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.data.note;
    } else {
      throw new Error("Failed To Create Note");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteNote(id: number) {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/notes/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      return;
    } else throw new Error("Failed To Fetch");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function patchNote(id: number, title: string, content: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/notes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.data.note;
    } else {
      throw new Error("Failed To Update Note");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
