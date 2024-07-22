import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { Input, Button, Spacer } from "@nextui-org/react";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading durumu için ekledim

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mesaj gönderme işlemi burada yapılacak
    console.log("Message submitted:", message);

    // Simülasyon için bir timeout kullanabiliriz
    setTimeout(() => {
      setLoading(false);
      setMessage(""); // Mesajı gönderdikten sonra inputu temizleriz
    }, 1000);
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="w-full relative flex items-center">
        <Input
          fullWidth
          clearable
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Spacer x={2}/>
        <Button
          auto
          flat
          type="submit"
          disabled={loading}
          color="primary"
          className="right-0 flex items-center p-2"  
        >
          {loading ? (
            <div className="spinner" />
          ) : (
            <PaperAirplaneIcon className="h-5 w-5 text-white" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;