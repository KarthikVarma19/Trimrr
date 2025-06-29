import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) {
      navigate(`/auth?createNew=${longUrl}`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
        The Only URL Shortener <br />
        you&rsquo;ll ever need!👇
      </h2>
      <form
        className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2"
        onSubmit={handleShorten}
      >
        <Input
          type="url"
          value={longUrl}
          placeholder="Enter your loooong url"
          className="h-full flex-1 py-4 px-4"
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <Button
          className="h-full cursor-pointer"
          type="submit"
          variant="destructive"
        >
          Shorten!
        </Button>
      </form>
      <img
        src="/homebanner.jpeg"
        alt="banner"
        className="w-full my-11 md:px-11"
      />
      <Accordion type="multiple" collapsible="true" className="w-full md:px-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            How does the Trimmr URL Shortener Work?
          </AccordionTrigger>
          <AccordionContent>
            When you enter a long URL, our system generates a shorter version of
            that URL. This shortened URL redirects to the original long URL when
            accessed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is Trimmr free to use?</AccordionTrigger>
          <AccordionContent>
            Yes, Trimmr is completely free to use for shortening URLs. You can
            create as many shortened URLs as you need without any cost.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            Can I track clicks on my shortened URLs?
          </AccordionTrigger>
          <AccordionContent>
            Yes, Trimmr does support click tracking. However, we are working on
            adding analytics features in the future.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Are shortened URLs permanent?</AccordionTrigger>
          <AccordionContent>
            Yes, the shortened URLs created by Trimmr are permanent and will
            always redirect to the original URL unless deleted manually.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>
            Is there a limit to the number of URLs I can shorten?
          </AccordionTrigger>
          <AccordionContent>
            No, there is no limit to the number of URLs you can shorten using
            Trimmr. Feel free to shorten as many URLs as you need.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>
            Does Trimmr work with all types of URLs?
          </AccordionTrigger>
          <AccordionContent>
            Yes, Trimmr works with all types of URLs, including HTTP, HTTPS, and
            even custom protocols. Just paste your URL and shorten it!
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Landing;
